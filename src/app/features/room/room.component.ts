import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ROOM_CONFIG, RoomType } from './room-types';
import { FloorGridComponent } from "./floor-grid/floor-grid.component";
import { GameStore } from 'src/app/core/game.store';

@Component({
	selector: 'app-room',
	standalone: true,
	imports: [
		CommonModule,
		FloorGridComponent
	],
	templateUrl: './room.component.html',
	styleUrl: './room.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style.background-image]': 'backgroundImage()',
		'[style.--transition-duration]': 'gameStore.gameSpeedMs() + "ms"',
	}
})
export class RoomComponent {
	public gameStore = inject(GameStore);
	
	public roomType = input.required<RoomType>();

	/** A computed signal to get the room's configuration data based on its type. */
	public roomData = computed(() => ROOM_CONFIG[this.roomType()]);

	public backgroundImage = computed(() => `url(${this.roomData().image})`);
}
