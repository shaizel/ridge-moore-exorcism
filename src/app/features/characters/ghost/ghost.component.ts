import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { SpriteComponent } from '../../../shared/sprite/sprite.component';
import { AnimationName } from '../../../shared/sprite/sprite-types';
import { GridPositionDirective } from 'src/app/shared/directives/grid-position.directive';

@Component({
	selector: 'app-ghost',
	standalone: true,
	imports: [CommonModule, SpriteComponent],
	templateUrl: './ghost.component.html',
	styleUrl: './ghost.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: GridPositionDirective,
			inputs: ['appGridPosition', 'offsetX', 'offsetY'],
		}, 
	],
})
export class GhostComponent implements OnInit, OnDestroy {
	@ViewChild(SpriteComponent) sprite!: SpriteComponent;

	public animation: WritableSignal<AnimationName> = signal('faceS');

	ngOnInit() {
		
	}

	public ngOnDestroy(): void {
		
	}
}