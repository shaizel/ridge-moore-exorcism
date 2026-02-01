import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState } from '@ngrx/signals';
import { Npc } from '../../characters/npc/npc.store';
import { NPC_CONFIG } from '../../characters/npc/npc-types'; 

// A unified interface representing any character that can take a turn.
export interface QueueEntry {
    id: typeof PLAYER | number;
    portrait: string;
}

export const PLAYER = {};

export const CharacterQueueStore = signalStore(
	{ providedIn: 'root' },
	withState({ characterQueue: [] as QueueEntry[] }),
	withComputed((store) => ({
		// A computed signal for the currently active character.
		activeCharacter: computed(() => store.characterQueue()[0]),
		playerTurnEnded: computed(() => store.characterQueue()[store.characterQueue().length - 1].id === PLAYER),
	})),
	withMethods((store) => {
		return { 
			initializeQueue(npcs: Npc[]) {
				const playerActor: QueueEntry = { id: PLAYER, portrait: 'assets/static/priest portrait.png' };
				const npcActors: QueueEntry[] = npcs.map((npc: Npc) => ({ id: npc.id, portrait: NPC_CONFIG[npc.type].portrait }));
				patchState(store, { characterQueue: [playerActor, ...npcActors] });
			},
			nextCharacter() {
				const currentQueue = store.characterQueue();
				const nextQueue = [...currentQueue.slice(1), currentQueue[0]];
				patchState(store, { characterQueue: nextQueue });
			}
		};
	})
);