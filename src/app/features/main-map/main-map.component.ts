import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-main-map',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: './main-map.component.html',
	styleUrl: './main-map.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMapComponent { }
