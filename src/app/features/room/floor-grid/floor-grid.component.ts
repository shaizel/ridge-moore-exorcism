import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { FloorTileComponent } from './floor-tile/floor-tile.component';
import { GRID_HEIGHT, GRID_WIDTH } from '../../../core/services/constants';
import { ITile } from '../../../core/interfaces/inerfaces';

@Component({
	selector: 'app-floor-grid',
	imports: [FloorTileComponent],
	templateUrl: './floor-grid.component.html',
	styleUrl: './floor-grid.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloorGridComponent implements OnInit {
	public mode = input.required<"foreground" | "background">();

	public tiles: ITile[][] = [];
	public selectedTile?: ITile;

	constructor() {
		
	}

	ngOnInit(): void {
		this.tiles = Array.from({ length: GRID_HEIGHT }, (_, y) =>
			Array.from({ length: GRID_WIDTH }, (_, x) => {
				return { position: { x, y } };
			})
		);
	}
}
