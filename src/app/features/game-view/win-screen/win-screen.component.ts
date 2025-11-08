import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { AudioService } from 'src/app/core/services/audio.service';

@Component({
	selector: 'app-win-screen',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: './win-screen.component.html',
	styleUrl: './win-screen.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinScreenComponent implements OnInit { 
	private audioService = inject(AudioService);

	ngOnInit() {
		this.audioService.stopAllSounds();
	}
}
