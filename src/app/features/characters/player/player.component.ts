import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, effect, inject, viewChild } from '@angular/core';
import { SpriteComponent } from "../../../shared/sprite/sprite.component";
import { PlayerStore, Position } from './player.store';
import { GridPositionDirective } from '../../../shared/directives/grid-position.directive';

@Component({
	selector: 'app-player',
	standalone: true,
	imports: [
		CommonModule,
		SpriteComponent
	],
	templateUrl: './player.component.html',
	styleUrl: './player.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: GridPositionDirective,
			inputs: ['appGridPosition', 'offsetX', 'offsetY'],
		}, 
	],
})
export class PlayerComponent implements OnInit, OnDestroy {
	private sprite = viewChild.required(SpriteComponent);

	private playerStore = inject(PlayerStore);
	public position = this.playerStore.position;
	public animation = this.playerStore.direction; // The animation should follow the store's direction 
	public isMoving = this.playerStore.isMoving;

	private movementInterval?: ReturnType<typeof setInterval>;
	private readonly MOVEMENT_SPEED_MS = 200; // Move one square every 200ms

	constructor() {
		// Effect to start/stop the movement loop based on the store's isMoving flag
		effect(() => {
			if (this.isMoving()) {
				this.startMovementLoop();
			} else {
				this.stopMovementLoop();
			}
		});
	}

	ngOnInit() { }

	public ngOnDestroy(): void {
		this.stopMovementLoop();
	}

	// This would be called by a map service when the user clicks a tile
	public moveToDestination(destination: Position): void {
		// In a real implementation, you would inject a pathfinding service
		// const path = this.pathfindingService.findPath(this.playerStore.position(), destination);
		const path: Position[] = [{ x: 6, y: 5 }, { x: 7, y: 5 }, { x: 7, y: 6 }]; // Example path
		this.playerStore.setPath(path);
	}

	private startMovementLoop(): void {
		if (this.movementInterval) {
			return; // Loop already running
		}
		this.movementInterval = setInterval(() => { 
			this.playerStore.takeStep();
		}, this.MOVEMENT_SPEED_MS);
	}

	private stopMovementLoop(): void {
		clearInterval(this.movementInterval);
		this.movementInterval = undefined;
	}
}
