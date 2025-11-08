import { ChangeDetectionStrategy, Component, computed, inject, input, output, Signal } from '@angular/core';
import { GridStore } from '../grid.store';
import { PathService } from 'src/app/core/services/path.service';
import { PlayerStore } from 'src/app/features/characters/player/player.store';
import { CharacterQueueStore, PLAYER } from 'src/app/features/game-view/character-queue/character-queue.store';
import { GRID_CELL_BLOCKED } from 'src/app/core/services/constants';
import { NpcStore } from 'src/app/features/characters/npc/npc.store';
import { RoomStore } from '../../room.store';

@Component({
	selector: 'app-floor-tile',
	imports: [],
	templateUrl: './floor-tile.component.html',
	styleUrl: './floor-tile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.start]': 'isStart()',
		'[class.path]': 'isPath()',
		'[class.selected]': 'isSelected()',
		'[class.available-for-player]': 'isAvailableForPlayer()',
		'[class.enemy-character]': 'isEnemyCharacter()',
		'[class.object]': 'isObject()'
	}
})
export class FloorTileComponent {
	public gridStore = inject(GridStore);
	private pathService = inject(PathService);
	public playerStore = inject(PlayerStore);
	private characterQueueStore = inject(CharacterQueueStore);
	private npcStore = inject(NpcStore);
	private roomStore = inject(RoomStore);

	/* inputs */
	public position = input.required<{ x: number; y: number }>();

	public tileContainerClickHandler(event: MouseEvent) {
		// TODO: Move this logic to the player
		if (this.playerStore.isMoving() || !this.isPlayerActive() || this.tileGridScore() === GRID_CELL_BLOCKED || this.tileGridScore() === 0 || this.tileGridScore() === Infinity) {
			return;
		}

		const currentSelectedPosition = this.gridStore.selectedPosition();
		const newPosition = this.position();

		// If the user clicks the same tile twice, move the player.
		if (currentSelectedPosition?.x === newPosition.x && currentSelectedPosition?.y === newPosition.y) {
			this.playerStore.setPath(this.gridStore.path());
		} else {
			// Otherwise, just calculate and show the new path.
			this.gridStore.setSelectedPosition(newPosition);
			const path = this.pathService.findPath(this.gridStore.scoredGrid()!, newPosition);
			this.gridStore.setPath(path);
		}
	}

	public tileGridScore: Signal<number | undefined> = computed(() => {
		return this.gridStore.scoredGrid()?.[this.position().x]?.[this.position().y];
	});

	public isStart: Signal<boolean> = computed(() => {
		return this.tileGridScore() === 0 && this.gridStore.path()?.length > 0;
	});

	public isSelected: Signal<boolean> = computed(() => {
		return this.gridStore.selectedPosition()?.x === this.position().x && this.gridStore.selectedPosition()?.y === this.position().y;
	});

	public isPath: Signal<boolean> = computed(() => {
		return !this.isStart() && !this.isSelected() && this.gridStore.path().some((step) => step.x === this.position().x && step.y === this.position().y);
	});

	public isPlayerActive: Signal<boolean> = computed(() => {
		return this.characterQueueStore.activeCharacter()?.id === PLAYER;
	});

	public isAvailableForPlayer: Signal<boolean> = computed(() => {
		return this.isPlayerActive() && this.tileGridScore() !== undefined && this.tileGridScore() !== GRID_CELL_BLOCKED && <number>this.tileGridScore() > 0 && <number>this.tileGridScore() < Infinity;
	});

	public isEnemyCharacter: Signal<boolean> = computed(() => {
		return this.npcStore.npcs().some((npc) => npc.position.x === this.position().x && npc.position.y === this.position().y);
	});

	public isObject: Signal<boolean> = computed(() => {
		return this.roomStore.objects().some((object) => object.position.x === this.position().x && object.position.y === this.position().y);
	});
}
