import { Component, inject } from '@angular/core';
import { RoomComponent } from "../features/room/room.component";
import { AudioService } from '../core/services/audio.service';
import { PlayerComponent } from "../features/characters/player/player.component";
import { GhostComponent } from "../features/characters/ghost/ghost.component";
import { ShadowComponent } from "../features/characters/shadow/shadow.component";
import { RoomObject, RoomStore } from '../features/room/room.store';
import { PlayerStore } from '../features/characters/player/player.store';

export interface RoomDefinition {
	id: number;
	name: string;
	backgroundImage: string;
	objects: RoomObject[];
}

export interface PlayerDefinition {
	position: Position;
}

export interface Position {
	x: number;
	y: number;
}

@Component({
	selector: 'app-demo',
	standalone: true,
	templateUrl: './demo.html',
	styleUrl: './demo.scss',
 	imports: [RoomComponent, PlayerComponent, GhostComponent, ShadowComponent],

})
export class Demo {
	private audioService: AudioService = inject(AudioService);
	private roomStore = inject(RoomStore);
	private playerStore = inject(PlayerStore);

	ngOnInit() {
		this.audioService.playAmbientMusic();


	}

	ngOnDestroy() {
		this.audioService.stopAmbientMusic();
	}

	// This would be called when the player moves to a new area.
    public async enterRoom(levelId: number) {
        // 1. Fetch the room data from a source (e.g., an API or a local JSON file)
        const { roomData, playerData } = this.fetchLevelData(levelId);

        // 2. Load the room's static data into the RoomStore
        this.roomStore.loadRoom(roomData);

        // 3. Use the room's definition to set the player's starting position
        // We can create a dedicated method in the PlayerStore for this.
        this.playerStore.setPosition(playerData.position);
    }

    private fetchLevelData(levelId: number): { roomData: RoomDefinition, playerData: PlayerDefinition } {
        // In a real app, this would be an HTTP call or file read.
        // For now, we'll return some mock data.
        return {
			roomData: {
				id: 0,
				name: 'Demo',
				backgroundImage: 'assets/rooms/brick-wall.png',
				objects: [
					{ id: 0, type: 'chair', position: { x: 12, y: 10 }, sprite: 'assets/objects/fountain.png', isSolid: true },
				]
			},
			playerData: {
				position: { x: 0, y: 0 },
			}
		};
    }
}
