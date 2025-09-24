import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type GameState = {
    gameSpeedMs: number;
};

const initialState: GameState = {
    gameSpeedMs: 300, // Default game speed
};

export const GameStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        /**
		 * Sets the game speed in milliseconds.
		 * @param speed The new game speed.
		 */
		setGameSpeed(speed: number): void {
			patchState(store, { gameSpeedMs: speed });
		},
    }))
);