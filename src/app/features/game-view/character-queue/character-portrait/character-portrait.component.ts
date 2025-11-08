import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { QueueEntry } from '../character-queue.store';
import { RoomStore } from 'src/app/features/room/room.store';
import { ROOM_CONFIG } from 'src/app/features/room/room-types';
import { MessageStore } from '../../message.store';

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
	private messageStore = inject(MessageStore);

	public backgroundUrl = computed(() => `url(${ROOM_CONFIG[this.roomStore.type()].portraitBackground})`);

	public currentMessage = this.messageStore.currentMessage;
	public showMessage = computed(() => this.currentMessage()?.characterId === this.entry().id);

	public messageBubbleClickHandler(e: any) {
		this.messageStore.popMessage();
	}
}
