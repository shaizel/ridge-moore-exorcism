import { CommonModule, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { AnimationName, SPRITE_CONFIG, SpriteType } from './sprite-types';
import { FRAMERATE } from '../../core/services/constants';

@Component({
	selector: 'app-sprite',
	standalone: true,
	imports: [CommonModule, NgStyle],
	templateUrl: './sprite.component.html',
	styleUrl: './sprite.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpriteComponent {
	public spriteType = input.required<SpriteType>();
	public animationName = input<AnimationName>('faceS');

	private config = computed(() => SPRITE_CONFIG[this.spriteType()]);
	private animationFrame = signal(0);
	private animationInterval?: ReturnType<typeof setInterval>;

	constructor() {
		effect((onCleanup) => {
			// Read signals to create dependencies
			const config = this.config();
			const animation = this.animationName();
			const animationConfig = config.animations[animation];

			this.animationFrame.set(0); // Reset frame on animation change

			// Only animate if there is more than one frame
			if (animationConfig.frameCount > 1) {
				this.animationInterval = setInterval(() => {
					this.animationFrame.update((frame) => (frame + 1) % animationConfig.frameCount);
				}, FRAMERATE); // ~6-7 FPS animation
				onCleanup(() => clearInterval(this.animationInterval));
			}
		});
	}

	public spriteStyle = computed(() => {
		const config = this.config();
		const animation = this.animationName();
		const frame = this.animationFrame();

		const animationConfig = config.animations[animation];
		// If frameCount is 1, bgY should be 0. Otherwise, calculate percentage.
		const bgY = animationConfig.frameCount > 1 ? (-frame * 100) / (animationConfig.frameCount - 1) : 0;

		// If animationCount is 1, bgX should be 0. Otherwise, calculate percentage.
		const bgX = config.animationCount > 1 ? (animationConfig.index * 100) / (config.animationCount - 1) : 0;

		return {
			'background-image': `url(${config.path})`,
			'background-position': `${bgX}% ${bgY}%`,
		};
	});
}
