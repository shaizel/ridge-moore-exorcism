import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, effect, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpriteComponent } from "../../../shared/sprite/sprite.component";
import { PlayerStore, Position } from './player.store';
import { GridStore } from '../../room/floor-grid/grid.store';
import { PathService } from '../../../core/services/path.service';
import { GameLoopService } from 'src/app/core/services/game-loop.service';
import { NpcStore } from '../npc/npc.store';
import { GameStore } from 'src/app/core/game.store';
import { AudioService } from 'src/app/core/services/audio.service';

@Component({
	selector: 'app-player',
	standalone: true,
	imports: [
		CommonModule,
		SpriteComponent
	],
	templateUrl: './player.component.html',
	styleUrl: './player.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnInit, OnDestroy {
	private playerStore = inject(PlayerStore);
	private gridStore = inject(GridStore);
	private pathService = inject(PathService);
	private gameLoop = inject(GameLoopService);
	private npcStore = inject(NpcStore);
	private gameStore = inject(GameStore);
	private audioService = inject(AudioService);

	public position = this.playerStore.position;
	public animation = this.playerStore.direction; // The animation should follow the store's direction 
	public isMoving = this.playerStore.isMoving;

	private heartbeatSoundId: number | null = null;

	constructor() {
		// The game loop runs independently. We just listen for ticks.
		this.gameLoop.tickObservable.pipe(takeUntilDestroyed()).subscribe(() => {
			if (this.isMoving()) {
				this.playerStore.takeStep();
			}
			// Always check proximity on every tick.
			this.checkProximityToNpcs();
		});

		// Effect to clean up grid state when movement stops.
		effect(() => {
			if (!this.isMoving()) {
				this.gridStore.setScoredGrid(this.pathService.getScoredGrid(this.playerStore.position()));
				this.gridStore.setPath([]);
				this.gridStore.setSelectedPosition(null);
			}
		});
	}

	ngOnInit() { }

	public ngOnDestroy(): void {
		if (this.heartbeatSoundId !== null) {
			this.audioService.stopLoopingSound(this.heartbeatSoundId);
		}
	}

	private checkProximityToNpcs(): void {
		const playerPos = this.playerStore.position();
		const npcs = this.npcStore.npcs();
		let minDistance = Infinity;

		for (const npc of npcs) {
			const distance = Math.sqrt(Math.pow(playerPos.x - npc.position.x, 2) + Math.pow(playerPos.y - npc.position.y, 2));
			if (distance < minDistance) {
				minDistance = distance;
			}
		}

		// Determine volume and game speed based on distance
		let volume = 0;
		let vignetteIntensity = 0;
		let playbackRate = 1.0;
		let gameSpeed = 300; // Default speed
		if (minDistance < 4) {
			if (minDistance <= 1) {
				volume = 1.0;
				gameSpeed = 800;
				playbackRate = 2.0;
				vignetteIntensity = 0.9;
			} else if (minDistance <= 2) {
				volume = 0.80;
				gameSpeed = 700;
				playbackRate = 1.8;
				vignetteIntensity = 0.7;
			} else if (minDistance <= 3) {
				volume = 0.5;
				gameSpeed = 600;
				playbackRate = 1.4;
				vignetteIntensity = 0.5;
			} else if (minDistance <= 4) {
				volume = 0.3;
				gameSpeed = 450;
				playbackRate = 1.2;
				vignetteIntensity = 0.3;
			}
		}

		if (volume > 0 && this.heartbeatSoundId === null) {
			// Start the sound if it's not already playing
			this.audioService.startLoopingSound('heartbeat', volume, playbackRate).then((id) => this.heartbeatSoundId = id);
		} else if (volume <= 0 && this.heartbeatSoundId !== null) {
			// Stop the sound if volume is zero
			this.audioService.stopLoopingSound(this.heartbeatSoundId);
			this.heartbeatSoundId = null;
		} else if (this.heartbeatSoundId !== null) {
			// Otherwise, just update the volume
			this.audioService.updateLoopingSoundVolume(this.heartbeatSoundId, volume);
			this.audioService.updateLoopingSoundPlaybackRate(this.heartbeatSoundId, playbackRate);
		}

		this.gameStore.setGameSpeed(gameSpeed);
		this.gameStore.setVignetteIntensity(vignetteIntensity);
	}
}
