import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { SpriteComponent } from '../../../shared/sprite/sprite.component';
import { AnimationName } from '../../../shared/sprite/sprite-types';

@Component({
	selector: 'app-ghost',
	standalone: true,
	imports: [CommonModule, SpriteComponent],
	templateUrl: './ghost.component.html',
	styleUrl: './ghost.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostComponent implements OnInit, OnDestroy {
	@ViewChild(SpriteComponent) sprite!: SpriteComponent;

	public animation: WritableSignal<AnimationName> = signal('faceS');

	private interval?: ReturnType<typeof setInterval>;

	ngOnInit() {
		const animations: AnimationName[] = ['faceS', 'faceW', 'faceE', 'faceN'];
		let animationIndex: number = 0;
		this.interval = setInterval(() => {
			this.animation.set(animations[animationIndex]);
			animationIndex = (animationIndex + 1) % animations.length;
		}, 1000);
	}

	public ngOnDestroy(): void {
		clearInterval(this.interval);
	}
}