import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { GridStore } from '../grid.store';
import { PathService } from 'src/app/core/services/path.service';
import { PlayerStore } from 'src/app/features/characters/player/player.store';
import { CharacterQueueStore, PLAYER } from 'src/app/features/game-view/character-queue/character-queue.store';
import { GRID_CELL_BLOCKED } from 'src/app/core/services/constants';

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
	}
})
export class FloorTileComponent {
	public gridStore = inject(GridStore);
	private pathService = inject(PathService);
	public playerStore = inject(PlayerStore);
	private characterQueueStore = inject(CharacterQueueStore);

	/* inputs */
	public position = input.required<{ x: number; y: number }>();

	public tileContainerClickHandler(event: MouseEvent) {
		if (this.playerStore.isMoving() || !this.isPlayerActive() || this.gridStore.scoredGrid()?.[this.position().x][this.position().y] === GRID_CELL_BLOCKED || this.gridStore.scoredGrid()?.[this.position().x][this.position().y] === 0) {
			return;
		}

		this.gridStore.setSelectedPosition(this.position());
		const path = this.pathService.findPath(this.gridStore.scoredGrid()!, this.position());
		this.gridStore.setPath(path);
		this.playerStore.setPath(path);
	}

	public isStart = computed(() => {
		return this.gridStore.scoredGrid()?.[this.position().x]?.[this.position().y] === 0 && this.playerStore.isMoving();
	});

	public isSelected = computed(() => {
		return this.gridStore.selectedPosition()?.x === this.position().x && this.gridStore.selectedPosition()?.y === this.position().y;
	});

	public isPath = computed(() => {
		return !this.isStart() && !this.isSelected() && this.gridStore.path().some((step) => step.x === this.position().x && step.y === this.position().y);
	});

	public isPlayerActive = computed(() => {
		return this.characterQueueStore.activeCharacter()?.id === PLAYER;
	});
}
