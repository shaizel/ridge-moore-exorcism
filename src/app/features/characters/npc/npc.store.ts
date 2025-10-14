import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Position } from '../player/player.store';
import { NpcType } from './npc-types';

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
    withMethods((store) => ({
        loadNpcs(npcs: Npc[]) {
            patchState(store, { npcs });
        },
    }))
);
