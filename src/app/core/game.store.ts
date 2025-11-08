import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type GameState = {
    gameSpeedMs: number;
    vignetteIntensity: number;
    gameOverLost: boolean;
    gameOverWon: boolean;
};

const initialState: GameState = {
    gameSpeedMs: 300, // Default game speed
    vignetteIntensity: 0,
    gameOverLost: false,
    gameOverWon: false
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
        /**
         * Sets the intensity of the screen vignette effect.
         * @param intensity A value from 0 (off) to 1 (full).
         */
        setVignetteIntensity(intensity: number): void {
            patchState(store, { vignetteIntensity: intensity });
        },
        /**
         * Finish the game after losing
         */
        gameOverLose(): void {
            patchState(store, { gameOverLost: true });
        },
        /**
         * Finish the game after winning
         */
        gameOverWin(): void {
            patchState(store, { gameOverWon: true });
        }
    }))
);