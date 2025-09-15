import { Directive, HostBinding, computed, input } from '@angular/core';
import { Position } from '../../features/characters/player/player.store';

@Directive({
	selector: '[appGridPosition]',
	standalone: true,
	host: {
		'[style.left.%]': 'left()',
		'[style.top.%]': 'top()',
		'[style.transform]': 'transform()'
	}
})
export class GridPositionDirective {
	/**
	 * The grid position (x, y) for the element.
	 */
	public appGridPosition = input.required<Position>();

	/**
	 * An optional percent offset on the X-axis.
	 */
	public offsetX = input<number>(0);

	/**
	 * An optional percent offset on the Y-axis.
	 */
	public offsetY = input<number>(0);

	/**
	 * Computes the 'left' CSS property in percent.
	 */
	public left = computed(
		() => 11.5 + this.appGridPosition().x * 10 + this.appGridPosition().y * 10 //+ this.offsetX()
	);

	/**
	 * Computes the 'top' CSS property in percent.
	 */
	public top = computed(
		() => 50 - this.appGridPosition().x * 5 + this.appGridPosition().y * 5 //+ this.offsetY()
	);

	/**
	 * Computes the 'transform:translate' CSS property in percent.
	 */
	public transform = computed(
		() => `translate(${this.offsetX()}%, ${this.offsetY()}%)`
	);

	constructor() {}
}
