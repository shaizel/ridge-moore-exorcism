import { CommonModule, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { AnimationName, SPRITE_CONFIG, SpriteType } from './sprite-types';

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
			if (animationConfig.frames > 1) {
				this.animationInterval = setInterval(() => {
					this.animationFrame.update((frame) => (frame + 1) % animationConfig.frames);
				}, 150); // ~6-7 FPS animation
				onCleanup(() => clearInterval(this.animationInterval));
			}
		});
	}

	public spriteStyle = computed(() => {
		const config = this.config();
		const animation = this.animationName();
		const frame = this.animationFrame();

		const animationConfig = config.animations[animation];
		const bgX = -frame * config.frameWidth;
		const bgY = -animationConfig.row * config.frameHeight;

		return {
			'background-image': `url(${config.path})`,
			'width.px': config.frameWidth,
			'height.px': config.frameHeight,
			'background-position': `${bgX}px ${bgY}px`,
		};
	});
}
