import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
	selector: 'app-floor-tile',
	imports: [],
	templateUrl: './floor-tile.component.html',
	styleUrl: './floor-tile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorTileComponent {
	/* inputs */
	public position = input.required<{ x: number; y: number }>();

	/* outputs */
	public selected = output<void>();

	public tileContainerClickHandler(event: MouseEvent) {
		this.selected.emit();
	}
}
