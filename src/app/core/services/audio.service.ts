import { Injectable, OnDestroy } from '@angular/core';

const SOUND_ASSETS = {
	// Ambient Music
	'ambient_music': [
		'assets/audio/ambient_1.mp3',
		'assets/audio/ambient_2.mp3',
		'assets/audio/ambient_3.mp3'
	],

	// Sound Emitters
	'ghost': 'assets/audio/ghost.mp3',
	'man_scream': [
		'assets/audio/man_scream_1.mp3' 
	],
	'scuttling': [
		'assets/audio/scuttling_1.mp3'
	],

	// Misc.
	'heartbeat': 'assets/audio/heartbeat.mp3'
};

// Interface for managing emitters
interface Emitter {
	id: number;
	source: AudioBufferSourceNode;
	panner: PannerNode;
	buffer: AudioBuffer;
}

@Injectable({providedIn: 'root'})
export class AudioService implements OnDestroy {
	private audioContext: AudioContext;
	private emitters: { [id: number]: Emitter } = {};
	private audioBuffers: { [name: string]: AudioBuffer[] } = {};
	private loopingSounds: { [id: number]: { source: AudioBufferSourceNode, gainNode: GainNode } } = {};
	private ambientSource?: AudioBufferSourceNode;
	private preloadPromise: Promise<void>;
	private nextId = 0;

	constructor() {
		this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
		this.preloadPromise = this.preloadAllSounds();
	}

	private async preloadAllSounds(): Promise<void> {
		const loadPromises: Promise<void>[] = [];

		for (const [key, value] of Object.entries(SOUND_ASSETS)) {
			const urls = Array.isArray(value) ? value : [value];
			this.audioBuffers[key] = []; // Initialize as an empty array

			for (const url of urls) {
				const promise = this.loadSound(url).then(buffer => {
					this.audioBuffers[key].push(buffer);
				}).catch(error => {
					console.error(`Failed to load sound '${key}' from ${url}:`, error);
				});
				loadPromises.push(promise);
			}
		}

		await Promise.all(loadPromises);
		console.log('All sound files preloaded.', this.audioBuffers);
	}

	private getRandomBuffer(soundName: keyof typeof SOUND_ASSETS): AudioBuffer | undefined {
		const buffers = this.audioBuffers[soundName];
		if (!buffers || buffers.length === 0) {
			console.error(`Sound '${String(soundName)}' not preloaded or has no buffers.`);
			return undefined;
		}
		// Pick a random buffer from the array
		const randomIndex = Math.floor(Math.random() * buffers.length);
		return buffers[randomIndex];
	}

	private async loadSound(url: string): Promise<AudioBuffer> {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		return this.audioContext.decodeAudioData(arrayBuffer);
	}

	ngOnDestroy(): void {
		this.audioContext.close();
		Object.keys(this.loopingSounds).forEach((id) => this.stopLoopingSound(+id));
	}

	// --- Looping Sounds with Volume Control ---

	/**
	 * Starts a new looping sound and returns a unique ID for it.
	 * @param soundName The name of the sound to play.
	 * @param volume The initial volume (0.0 to 1.0).
	 * @param playbackRate The initial playback rate (1.0 is normal speed).
	 * @returns A unique number ID for the new sound instance.
	 */
	public async startLoopingSound(soundName: keyof typeof SOUND_ASSETS, volume: number, playbackRate = 1.0): Promise<number> {
		await this.preloadPromise;
		const id = this.nextId++;

		const audioBuffer = this.getRandomBuffer(soundName);
		if (!audioBuffer) {
			// Return a non-functional ID if sound can't be played
			return -1;
		}

		const source = this.audioContext.createBufferSource();
		const gainNode = this.audioContext.createGain();

		source.buffer = audioBuffer;
		source.loop = true;
		source.playbackRate.value = playbackRate;
		gainNode.gain.value = volume;

		source.connect(gainNode);
		gainNode.connect(this.audioContext.destination);
		source.start(0);

		this.loopingSounds[id] = { source, gainNode };
		return id;
	}

	public updateLoopingSoundVolume(id: number, volume: number): void {
		const sound = this.loopingSounds[id];
		if (sound) {
			sound.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
		}
	}

	public updateLoopingSoundPlaybackRate(id: number, rate: number): void {
		const sound = this.loopingSounds[id];
		if (sound) {
			sound.source.playbackRate.setValueAtTime(rate, this.audioContext.currentTime);
		}
	}

	public stopLoopingSound(id: number): void {
		const sound = this.loopingSounds[id];
		if (sound) {
			sound.source.stop();
			sound.source.disconnect();
			sound.gainNode.disconnect();
			delete this.loopingSounds[id];
		}
	}

	// --- Ambient Looping Music ---

	async playAmbientMusic(): Promise<void> {
		await this.preloadPromise;

		if (this.ambientSource) {
			// Ambient music is already playing
			return;
		}

		const ambientBuffer = this.getRandomBuffer('ambient_music');
		if (!ambientBuffer) {
			// Error is already logged by getRandomBuffer
			return;
		}

		this.ambientSource = this.audioContext.createBufferSource();
		this.ambientSource.buffer = ambientBuffer;
		this.ambientSource.loop = true;
		this.ambientSource.connect(this.audioContext.destination);
		this.ambientSource.start(0);
		console.log('Ambient music started.');
	}

	stopAmbientMusic(): void {
		if (this.ambientSource) {
			this.ambientSource.stop();
			this.ambientSource = undefined;
			console.log('Ambient music stopped.');
		}
	}

	/**
	 * Sets the listener's horizontal rotation, assuming the listener is always upright.
	 * @param forwardX The x-component of the forward-facing direction.
	 * @param forwardZ The z-component of the forward-facing direction.
	 */
	setListenerRotation(forwardX: number, forwardZ: number): void {
		const length = Math.sqrt(forwardX * forwardX + forwardZ * forwardZ);
		const normalizedX = length > 0 ? forwardX / length : 0;
		const normalizedZ = length > 0 ? forwardZ / length : -1; // Default to facing forward if length is 0
		this.setListenerOrientation(normalizedX, 0, normalizedZ, 0, 1, 0);
	}

	// --- Listener Control ---

	/**
	 * Sets the 3D position of the listener in the audio scene.
	 * @param x The x-coordinate of the listener's position.
	 * @param y The y-coordinate of the listener's position.
	 * @param z The z-coordinate of the listener's position.
	 */
	setListenerPosition(x: number, y: number, z: number = 1.8): void {
		const listener = this.audioContext.listener;
		const currentTime = this.audioContext.currentTime;

		listener.positionX.setValueAtTime(x, currentTime);
		listener.positionY.setValueAtTime(y, currentTime);
		listener.positionZ.setValueAtTime(z, currentTime);
	}

	/**
	 * Sets the full 3D orientation of the listener in the audio scene.
	 * This is useful for complex scenarios like looking up/down or tilting one's head.
	 * @param forwardX The x-component of the forward-facing direction vector.
	 * @param forwardY The y-component of the forward-facing direction vector.
	 * @param forwardZ The z-component of the forward-facing direction vector.
	 * @param upX The x-component of the up-direction vector (top of the listener's head).
	 * @param upY The y-component of the up-direction vector.
	 * @param upZ The z-component of the up-direction vector.
	 */
	setListenerOrientation(forwardX: number, forwardY: number, forwardZ: number, upX: number, upY: number, upZ: number): void {
		const listener = this.audioContext.listener;
		const currentTime = this.audioContext.currentTime;

		listener.forwardX.setValueAtTime(forwardX, currentTime);
		listener.forwardY.setValueAtTime(forwardY, currentTime);
		listener.forwardZ.setValueAtTime(forwardZ, currentTime);

		listener.upX.setValueAtTime(upX, currentTime);
		listener.upY.setValueAtTime(upY, currentTime);
		listener.upZ.setValueAtTime(upZ, currentTime);
	}

	// --- Sound Emitters ---

	async addEmitter(soundName: keyof typeof SOUND_ASSETS, x: number, y: number, z: number, loop = false): Promise<number> {
		await this.preloadPromise;
		const id = this.nextId++;

		if (this.emitters[id]) {
			console.warn(`Emitter with ID '${id}' already exists. Skipping.`);
			// This case should be impossible with internal ID generation, but it's a good safeguard.
			return id;
		}
		const audioBuffer = this.getRandomBuffer(soundName);
		if (!audioBuffer) {
			// Error is already logged by getRandomBuffer
			return -1;
		}

		// Create the nodes
		const source = this.audioContext.createBufferSource();
		const panner = this.audioContext.createPanner();

		// Configure the source
		source.buffer = audioBuffer;
		source.loop = loop;
		source.start(0);

		// Configure the panner
		panner.panningModel = 'HRTF';
		this.updateEmitterPosition(panner, x, y, z);

		// Connect the nodes
		source.connect(panner);
		panner.connect(this.audioContext.destination);

		// Store the emitter
		this.emitters[id] = { id, source, panner, buffer: audioBuffer };
		console.log(`Emitter '${id}' added and playing sound '${soundName}' at position (${x}, ${y}, ${z}).`);
		return id;
	}

	updateEmitterPosition(idOrPanner: number | PannerNode, x: number, y: number, z: number): void {
		const panner = typeof idOrPanner === 'number' ? this.emitters[idOrPanner]?.panner : idOrPanner;
		if (!panner) {
			console.warn(`Panner not found for emitter '${idOrPanner}'.`);
			return;
		}
		const currentTime = this.audioContext.currentTime;

		panner.positionX.setValueAtTime(x, currentTime);
		panner.positionY.setValueAtTime(y, currentTime);
		panner.positionZ.setValueAtTime(z, currentTime);
	}

	removeEmitter(id: number): void {
		const emitter = this.emitters[id];
		if (!emitter) {
			console.warn(`Emitter with ID '${id}' not found.`);
			return;
		}

		emitter.source.stop();
		emitter.source.disconnect();
		emitter.panner.disconnect();
		delete this.emitters[id];
		console.log(`Emitter '${id}' removed.`);
	}

	// A method to play a one-shot sound without managing a long-term emitter
	async playOneShotSound(soundName: keyof typeof SOUND_ASSETS, x: number, y: number, z: number): Promise<void> {
		await this.preloadPromise;

		const audioBuffer = this.getRandomBuffer(soundName);
		if (!audioBuffer) {
			// Error is already logged by getRandomBuffer
			return;
		}

		const source = this.audioContext.createBufferSource();
		const panner = this.audioContext.createPanner();

		source.buffer = audioBuffer;
		source.connect(panner);
		panner.connect(this.audioContext.destination);

		// Set position and play
		this.updateEmitterPosition(panner, x, y, z);
		source.start(0);

		// Clean up the nodes after the sound finishes
		source.onended = () => {
			source.disconnect();
			panner.disconnect();
		};
	}
}