import { computed, effect } from '@angular/core';
import { signalStore, withComputed, withMethods, patchState, withState, withHooks } from '@ngrx/signals';
import { Npc, NpcStore } from '../../characters/npc/npc.store';
import { inject, untracked } from '@angular/core';
import { NPC_CONFIG } from '../../characters/npc/npc-types';

/** A unified interface representing any character that can take a turn. */
export interface QueueEntry {
    id: typeof PLAYER | 'player';
    portrait: string;
    // Add other common properties if needed for the portrait, e.g., name, hp, etc.
}

export const PLAYER = {};

export const CharacterQueueStore = signalStore(
	{ providedIn: 'root' },
	withState({ characterQueue: [] as QueueEntry[] }),
	withComputed((store) => ({
		/** A computed signal for the currently active character. */
		activeCharacter: computed(() => store.characterQueue()[0]),
	})),
	withMethods((store) => ({
		/** Rotates the queue to make the next character active. */
		nextTurn() {
			const currentQueue = store.characterQueue();
			const nextQueue = [...currentQueue.slice(1), currentQueue[0]];
			patchState(store, { characterQueue: nextQueue });
		}
	})),
	withHooks({
		onInit(store) {
			const npcStore = inject(NpcStore);
			// Use an effect to reactively rebuild the character queue whenever NPCs change.
			effect(() => {
				const npcs = npcStore.npcs(); // This is the reactive dependency.
				const playerActor: QueueEntry = { id: PLAYER, portrait: 'assets/static/priest portrait.png' };
				const npcActors: QueueEntry[] = npcs.map((npc: Npc) => ({ id: npc.id, portrait: NPC_CONFIG[npc.type].portrait }));

				// Use untracked to prevent an infinite loop when patching the state.
				untracked(() => {
					patchState(store, { characterQueue: [playerActor, ...npcActors] });
				});
			});
		},
	})
);