import { Injectable, OnDestroy, effect, inject } from '@angular/core';
import { GameStore } from '../game.store';
import { Subject } from 'rxjs';
import { CharacterQueueStore, PLAYER } from 'src/app/features/game-view/character-queue/character-queue.store';
import { PlayerStore } from 'src/app/features/characters/player/player.store';
import { NpcStore } from 'src/app/features/characters/npc/npc.store';
import { NPC_CONFIG } from 'src/app/features/characters/npc/npc-types';
import { AudioService } from './audio.service';

@Injectable({ providedIn: 'root' })
export class GameLoopService implements OnDestroy {
	private gameStore = inject(GameStore);
	private characterQueueStore = inject(CharacterQueueStore);
	private npcStore = inject(NpcStore);
	private audioService = inject(AudioService);

	private isTicking = false;
	private loopId?: ReturnType<typeof setInterval>;

	private tickSubject = new Subject<void>();
	public tickObservable = this.tickSubject.asObservable();

	constructor() {
		// When the game speed changes in the store, restart the loop
		// to apply the new speed.
		effect(() => {
			this.gameStore.gameSpeedMs(); // Depend on the signal
			if (this.loopId) {
				this.restart();
			}
		});
	}

	public start(): void {
		if (this.loopId) {
			return; // Loop is already running
		}

		this.loopId = setInterval(() => {
			this.tick();
		}, this.gameStore.gameSpeedMs());
	}

	public stop(): void {
		clearInterval(this.loopId);
		this.loopId = undefined;
	}

	private restart(): void {
		this.stop();
		this.start();
	}

	private async tick(): Promise<void> {
		// Prevent re-entry if the previous tick's async operations are not yet complete.
		if (this.isTicking) {
			return;
		}
		this.isTicking = true;

		this.tickSubject.next();

		const activeCharacter = this.characterQueueStore.activeCharacter();
		if (!activeCharacter) return;

		if (activeCharacter.id === PLAYER) {
			// It's the player's turn. The player component handles its own actions via tickObservable.
		} else {
			// It's an NPC's turn.
			const npc = this.npcStore.npcs().find((n) => n.id === activeCharacter.id);
			if (npc) {
				if (await NPC_CONFIG[npc.type].action(npc, this.audioService)) { // If turn is finished, switch to next character's turn
					this.characterQueueStore.nextTurn();
				}
			}
		}

		this.isTicking = false;
	}

	ngOnDestroy(): void {
		this.stop();
	}
}