import { ChangeDetectionStrategy, Component, computed, inject, input, output, Signal } from '@angular/core';
import { GameStore } from 'src/app/core/game.store';
import { PlayerStore } from 'src/app/features/characters/player/player.store';
import { SpriteComponent } from "src/app/shared/sprite/sprite.component";
import { CharacterQueueStore, PLAYER } from '../../game-view/character-queue/character-queue.store';

@Component({
	selector: 'app-door-mock',
	imports: [SpriteComponent],
	templateUrl: './door-mock.component.html',
	styleUrl: './door-mock.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoorMockComponent {
	public playerStore = inject(PlayerStore);
	public gameStore = inject(GameStore);
	public characterQueueStore = inject(CharacterQueueStore);

	// inputs
	public side = input.required<"N" | "S" | "E" | "W">();

	public state = closed;

	public doorClickHandler() {
		if (this.isNearDoor() && this.characterQueueStore.activeCharacter()?.id === PLAYER) {
			this.gameStore.gameOverWin();
		}
	}

	public isNearDoor: Signal<boolean> = computed(() => {
		return this.playerStore.position().x === 11 && (this.playerStore.position().y === 5 || this.playerStore.position().y === 6);
	});
}
