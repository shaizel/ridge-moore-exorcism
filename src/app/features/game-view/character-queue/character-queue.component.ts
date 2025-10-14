import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CharacterPortraitComponent } from './character-portrait/character-portrait.component';
import { CharacterQueueStore } from './character-queue.store';

@Component({
	selector: 'app-character-queue',
	standalone: true,
	imports: [
		CommonModule,
		CharacterPortraitComponent
	],
	templateUrl: './character-queue.component.html',
	styleUrl: './character-queue.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterQueueComponent { 
	private characterQueueStore = inject(CharacterQueueStore);

	public characterQueue = this.characterQueueStore.characterQueue;
	public activeCharacter = this.characterQueueStore.activeCharacter;
}
