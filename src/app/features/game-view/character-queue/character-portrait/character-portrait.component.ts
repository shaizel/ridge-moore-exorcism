import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { QueueEntry } from '../character-queue.store';
import { RoomStore } from 'src/app/features/room/room.store';
import { ROOM_CONFIG } from 'src/app/features/room/room-types';

@Component({
	selector: 'app-character-portrait',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: './character-portrait.component.html',
	styleUrl: './character-portrait.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterPortraitComponent { 
	public entry = input.required<QueueEntry>();

	private roomStore = inject(RoomStore);

	public backgroundUrl = computed(() => `url(${ROOM_CONFIG[this.roomStore.type()].portraitBackground})`);
}
