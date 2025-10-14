/**
 * Defines the available types of rooms in the game.
 */
export type RoomType = 'brick_wall' | 'cabin';

/**
 * Defines the configuration properties for a single room type.
 */
export interface RoomConfig {
	image: string;
	portraitBackground: string;
}

/**
 * A record mapping each RoomType to its specific configuration.
 */
export const ROOM_CONFIG: Record<RoomType, RoomConfig> = {
	brick_wall: { 
		image: 'assets/rooms/brick_wall.png',
		portraitBackground: 'assets/rooms/brick_wall_background.png'
	},
	cabin: { 
		image: 'assets/rooms/brick_wall.png',
		portraitBackground: 'assets/rooms/brick_wall_background.png'
	}
};