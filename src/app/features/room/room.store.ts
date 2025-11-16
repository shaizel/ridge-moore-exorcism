import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Position } from '../characters/player/player.store';
import { RoomType } from './room-types';

//#region Interfaces

/** Represents a static object within a room. */
export interface RoomObject {
	id: number;
	type: 'chair' | 'inner-wall';
	position: Position;
	sprite: string; // Path to the sprite/image asset
	isSolid: boolean;
}

/** Defines the overall state of a room. */
type RoomState = {
	id: number;
	name: string;
	backgroundImage: string;
	objects: RoomObject[];
	type: RoomType;
}

//#endregion

// const initialState: RoomState = {
// 	id: 1,
// 	name: 'Living Room',
// 	backgroundImage: 'assets/rooms/brick-wall.png',
// 	objects: [
// 		{ id: 0, type: 'chair', position: { x: 3, y: 4 }, sprite: 'assets/objects/chair.png', isSolid: true },
// 		{ id: 1, type: 'table', position: { x: 8, y: 8 }, sprite: 'assets/objects/table.png', isSolid: true },
// 	]
// };

const initialState: RoomState = {
	id: NaN,
	name: '',
	backgroundImage: '',
	objects: [],
	type: 'brick_wall', // Default value
};

export const RoomStore = signalStore( 
	{ providedIn: 'root' },
	withState(initialState),
    withMethods((store: any) => ({
        /**
		 * Loads a new room into the store, replacing the current one.
		 * @param room The definition of the room to load.
		 */
		loadRoom(room: RoomState) {
			patchState(store, { ...room });
		}
    }))
);
