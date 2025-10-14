import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CharacterQueueComponent } from './character-queue/character-queue.component';

@Component({
	selector: 'app-game-view',
	standalone: true,
	imports: [
		CommonModule,
		CharacterQueueComponent
	],
	templateUrl: './game-view.component.html',
	styleUrl: './game-view.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameViewComponent { }
