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
	withMethods((store) => ({
		setPosition(position: Position) {
			patchState(store, { position });
		},

		move(dx: number, dy: number) {
			let newDirection = store.direction();
			if (dx > 0) newDirection = 'faceE';
			if (dx < 0) newDirection = 'faceW'; 
			if (dy > 0) newDirection = 'faceS';
			if (dy < 0) newDirection = 'faceN';

			patchState(store, (state) => ({
				position: {
					x: state.position.x + dx,
					y: state.position.y + dy,
				},
				direction: newDirection,
			}));
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
			patchState(store, () => ({
				direction: direction,
			}));
		},
		
		takeStep() {
			if (!store.isMoving() || store.path().length === 0) {
				patchState(store, { isMoving: false });
				return;
			}

			const currentPosition = store.position();
			const nextPosition = store.path()[0];

			const dx = nextPosition.x - currentPosition.x;
			const dy = nextPosition.y - currentPosition.y;

			let newDirection = store.direction();
			if (dx > 0) newDirection = 'faceE';
			if (dx < 0) newDirection = 'faceW';
			if (dy > 0) newDirection = 'faceS';
			if (dy < 0) newDirection = 'faceN';

			// Remove the step we just took from the path
			patchState(store, (state) => ({
				position: nextPosition,
				direction: newDirection,
				path: state.path.slice(1),
			}));
		},
	}))
);
