import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Grid } from 'src/app/core/interfaces/inerfaces';
import { Position } from 'src/app/demo/demo';

type GridState = {
    scoredGrid: Grid | null;
    selectedPosition: Position | null;
    path: Position[];
};

const initialState: GridState = {
    scoredGrid: null,
    selectedPosition: null,
    path: [],
};

export const GridStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        setScoredGrid(scoredGrid: Grid) {
            patchState(store, { scoredGrid });
        },
        setSelectedPosition(selectedPosition: Position | null) {
            patchState(store, { selectedPosition });
        },
        setPath(path: Position[]) {
            patchState(store, { path });
        }
    }))
);

