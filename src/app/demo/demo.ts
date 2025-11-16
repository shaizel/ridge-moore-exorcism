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
import { CharacterQueueComponent } from '../features/game-view/character-queue/character-queue.component';
import { RoomType } from '../features/room/room-types';
import { PLAYER } from '../features/game-view/character-queue/character-queue.store';
import { MessageStore } from '../features/game-view/message.store';
import { DeathScreenComponent } from "../features/game-view/death-screen/death-screen.component";
import { GameStore } from '../core/game.store';
import { DoorMockComponent } from "../features/room/door-mock/door-mock.component";
import { WinScreenComponent } from "../features/game-view/win-screen/win-screen.component";

export interface RoomDefinition {
	id: number;
	name: string;
	backgroundImage: string;
	objects: RoomObject[];
	type: RoomType;
	doors: ("N" | "S" | "E" | "W")[]
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
 	imports: [RoomComponent, PlayerComponent, GridPositionDirective, NpcComponent, CharacterQueueComponent, DeathScreenComponent, DoorMockComponent, WinScreenComponent],
})
export class Demo {
	private audioService: AudioService = inject(AudioService);
	public roomStore = inject(RoomStore);
	public playerStore = inject(PlayerStore);
	public npcStore = inject(NpcStore);
	private gridStore = inject(GridStore);
	private pathService = inject(PathService);
	private gameLoop = inject(GameLoopService);
	private messageStore = inject(MessageStore);
	public gameStore = inject(GameStore);

	ngOnInit() {
		this.audioService.playAmbientMusic();
		this.gameLoop.start();

		this.enterRoom(0);
		

		// this.gridStore.setScoredGrid(this.pathService.getScoredGrid(this.playerStore.position()));
	}

	ngOnDestroy() {
		this.audioService.stopAllSounds();
	}

	// This would be called when the player moves to a new area.
    public async enterRoom(levelId: number) {
		this.gameStore.restartGame();

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

		this.messageStore.addMessage({
			characterId: PLAYER,
			text: "I've got to get out of here!",
			styleObject: {
				justifyContent: "center",
				alignItems: "center",
				// fontSize: "7vh",
				textAlign: "center"
			}
		});
		this.messageStore.addMessage({
			characterId: PLAYER,
			text: "I have to get to the door before these... THINGS get me!",
			styleObject: {
				justifyContent: "center",
				alignItems: "center",
				// fontSize: "7vh",
				textAlign: "center"
			}
		});
		this.messageStore.addMessage({
			characterId: 100,
			text: "I SEEEEEE YOUUUUUUUUUUU",
			styleObject: {
				justifyContent: "center",
				alignItems: "center",
				// fontSize: "7vh",
				textAlign: "center"
			},
			action: () => this.audioService.playOneShotSound('shadow_i_see_you', this.playerStore.position().x, this.playerStore.position().y, 1.8)
		});
    }

    private fetchLevelData(levelId: number): { roomData: RoomDefinition, playerData: PlayerDefinition, npcData: Npc[] } {
        // In a real app, this would be an HTTP call or file read.
        // For now, we'll return some mock data.
        return {
			roomData: {
				id: 0,
				name: 'Demo',
				backgroundImage: 'assets/rooms/brick-wall.png',
				type: 'brick_wall',
				objects: [
					{ x: 0, y: 1 },
					{ x: 1, y: 1 },
					{ x: 2, y: 1 },
					{ x: 3, y: 1 },
					{ x: 4, y: 1 },
					{ x: 5, y: 1 },
					{ x: 7, y: 1 },
					{ x: 11, y: 1 },
					{ x: 0, y: 2 },
					{ x: 7, y: 2 },
					{ x: 9, y: 2 },
					{ x: 11, y: 2 },
					{ x: 0, y: 3 },
					{ x: 2, y: 3 },
					{ x: 3, y: 3 },
					{ x: 4, y: 3 },
					{ x: 5, y: 3 },
					{ x: 6, y: 3 },
					{ x: 7, y: 3 },
					{ x: 9, y: 3 },
					{ x: 11, y: 3 },
					{ x: 0, y: 4 },
					{ x: 2, y: 4 },
					{ x: 7, y: 4 },
					{ x: 11, y: 4 },
					{ x: 0, y: 5 },
					{ x: 2, y: 5 },
					{ x: 4, y: 5 },
					{ x: 6, y: 5 },
					{ x: 7, y: 5 },
					{ x: 8, y: 5 },
					{ x: 9, y: 5 },
					{ x: 10, y: 5 },
					{ x: 0, y: 6 },
					{ x: 4, y: 6 },
					{ x: 0, y: 7 },
					{ x: 1, y: 7 },
					{ x: 3, y: 7 },
					{ x: 4, y: 7 },
					{ x: 5, y: 7 },
					{ x: 6, y: 7 },
					{ x: 8, y: 7 },
					{ x: 9, y: 7 },
					{ x: 10, y: 7 },
					{ x: 11, y: 7 },
					{ x: 11, y: 8 },
					{ x: 0, y: 9 },
					{ x: 2, y: 9 },
					{ x: 3, y: 9 },
					{ x: 4, y: 9 },
					{ x: 5, y: 9 },
					{ x: 6, y: 9 },
					{ x: 7, y: 9 },
					{ x: 8, y: 9 },
					{ x: 9, y: 9 },
					{ x: 11, y: 9 },
					{ x: 0, y: 10 },
					{ x: 11, y: 10 },
					{ x: 0, y: 11 },
					{ x: 1, y: 11 },
					{ x: 2, y: 11 },
					{ x: 3, y: 11 },
					{ x: 4, y: 11 },
					{ x: 5, y: 11 },
					{ x: 6, y: 11 },
					{ x: 7, y: 11 },
					{ x: 8, y: 11 },
					{ x: 9, y: 11 },
					{ x: 10, y: 11 },
					{ x: 11, y: 11 }
				].map((position, index) => ({ id: index, type: 'inner-wall', position: position, sprite: 'assets/static/inner wall.png', isSolid: true })),
				doors: ["E"]
			},
			playerData: {
				position: { x: 0, y: 0 },
			},
			npcData: [
				{ id: 100, type: 'shadow', position: { x: 10, y: 10 }, direction: 'faceS' },
				{ id: 101, type: 'ghost', position: { x: 11, y: 0 }, direction: 'faceE' }
			]
		};
    }
}
