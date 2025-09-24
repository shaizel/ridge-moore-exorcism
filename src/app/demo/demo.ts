import { Component, inject } from '@angular/core';
import { RoomComponent } from "../features/room/room.component";
import { AudioService } from '../core/services/audio.service';
import { PlayerComponent } from "../features/characters/player/player.component";
import { RoomObject, RoomStore } from '../features/room/room.store';
import { PlayerStore } from '../features/characters/player/player.store';
import { PathService } from '../core/services/path.service';
import { GridStore } from '../features/room/floor-grid/grid.store';
import { GridPositionDirective } from '../shared/directives/grid-position.directive';
import { Npc, NpcStore } from '../features/characters/npc/npc.store';
import { GameLoopService } from '../core/services/game-loop.service';
import { NpcComponent } from '../features/characters/npc/npc.component';

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
 	imports: [RoomComponent, PlayerComponent, GridPositionDirective, NpcComponent],
})
export class Demo {
	private audioService: AudioService = inject(AudioService);
	public roomStore = inject(RoomStore);
	public playerStore = inject(PlayerStore);
	public npcStore = inject(NpcStore);
	private gridStore = inject(GridStore);

	private pathService = inject(PathService);
	private gameLoop = inject(GameLoopService);


	ngOnInit() {
		this.audioService.playAmbientMusic();
		this.gameLoop.start();

		this.enterRoom(0);
		

		// this.gridStore.setScoredGrid(this.pathService.getScoredGrid(this.playerStore.position()));
	}

	ngOnDestroy() {
		this.audioService.stopAmbientMusic();
	}

	// This would be called when the player moves to a new area.
    public async enterRoom(levelId: number) {
        // Fetch the room data from a source (e.g., an API or a local JSON file)
        const { roomData, playerData, npcData } = this.fetchLevelData(levelId);

        // Load the room's static data into the RoomStore
        this.roomStore.loadRoom(roomData);

		// Load NPCs into their store
		this.npcStore.loadNpcs(npcData);

        // Use the room's definition to set the player's starting position
        // We can create a dedicated method in the PlayerStore for this.
        this.playerStore.setPosition(playerData.position);
		this.gridStore.setScoredGrid(this.pathService.getScoredGrid(playerData.position))
    }

    private fetchLevelData(levelId: number): { roomData: RoomDefinition, playerData: PlayerDefinition, npcData: Npc[] } {
        // In a real app, this would be an HTTP call or file read.
        // For now, we'll return some mock data.
        return {
			roomData: {
				id: 0,
				name: 'Demo',
				backgroundImage: 'assets/rooms/brick-wall.png',
				objects: [
					{ id: 0, type: 'chair', position: { x: 8, y: 10 }, sprite: 'assets/static/chair.png', isSolid: true },
					{ id: 1, type: 'chair', position: { x: 2, y: 4 }, sprite: 'assets/static/chair.png', isSolid: true },
					{ id: 2, type: 'chair', position: { x: 7, y: 6 }, sprite: 'assets/static/chair.png', isSolid: true },
					{ id: 3, type: 'chair', position: { x: 9, y: 2 }, sprite: 'assets/static/chair.png', isSolid: true },
				]
			},
			playerData: {
				position: { x: 0, y: 0 },
			},
			npcData: [
				{ id: 100, type: 'ghost', position: { x: 9, y: 7 }, direction: 'faceS' },
				{ id: 101, type: 'shadow', position: { x: 5, y: 3 }, direction: 'faceE' },
			]
		};
    }
}
