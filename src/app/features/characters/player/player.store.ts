// player.store.ts
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { AnimationName } from '../../../shared/sprite/sprite-types';

export interface Position {
	x: number;
	y: number;
}

type PlayerState = {
	position: Position;
	direction: AnimationName;
	path: Position[];
	isMoving: boolean;
}

const initialState: PlayerState = {
	position: { x: 5, y: 5 },
	direction: 'faceS',
	path: [],
	isMoving: false,
};

export const PlayerStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withMethods((store) => {
		function getDirectionForMove(current: Position, next: Position): AnimationName {
			const dx = next.x - current.x;
			const dy = next.y - current.y;

			if (dx > 0) return 'faceE';
			if (dx < 0) return 'faceW';
			if (dy > 0) return 'faceS';
			if (dy < 0) return 'faceN';

			return store.direction();
		}

		return {
			setPosition(position: Position) {
				patchState(store, { position });
			},

			setPath(path: Position[]) {
				// Don't accept a new path if already moving
				if (store.isMoving()) {
					return;
				}
				// Set the path and mark the player as moving.
				patchState(store, { path, isMoving: true });
			},

			setDirection(direction: AnimationName) {
				patchState(store, { direction });
			},

			takeStep() {
				if (!store.isMoving() || store.path().length === 0) {
					patchState(store, { isMoving: false });
					return;
				}

				const currentPosition = store.position();
				const nextPosition = store.path()[0];
				const newDirection = getDirectionForMove(currentPosition, nextPosition);

				// Remove the step we just took from the path
				patchState(store, (state) => ({
					position: nextPosition,
					direction: newDirection,
					path: state.path.slice(1),
				}));
			},
		};
	})
);
