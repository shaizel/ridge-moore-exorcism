import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

@Component({
	selector: 'app-death-screen',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: './death-screen.component.html',
	styleUrl: './death-screen.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeathScreenComponent { 
	
}
