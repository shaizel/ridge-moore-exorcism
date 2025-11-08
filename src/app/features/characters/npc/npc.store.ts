import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Position } from '../player/player.store';
import { NpcType } from './npc-types';
import { CharacterQueueStore } from '../../game-view/character-queue/character-queue.store';
import { inject } from '@angular/core';

export interface Npc {
    id: number;
    type: NpcType;
    position: Position;
    direction: 'faceN' | 'faceS' | 'faceE' | 'faceW';
}

type NpcState = {
    npcs: Npc[];
};

const initialState: NpcState = {
    npcs: [],
};

export const NpcStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, characterQueueStore = inject(CharacterQueueStore)) => {
        return {
            loadNpcs(npcs: Npc[]) {
                patchState(store, { npcs });
                characterQueueStore.initializeQueue(npcs);
            },
            moveNpc(id: number, position: Position, direction: string) {
                patchState(store, (state) => ({
                    npcs: state.npcs.map((npc) =>
                        npc.id === id
                            ? {
                                ...npc,
                                position,
                                direction: direction as Npc['direction'],
                            } : npc
                    ),
                }));
            }
        }
    })
);
