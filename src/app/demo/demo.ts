import { Component, inject } from '@angular/core';
import { RoomComponent } from "../features/room/room.component";
import { AudioService } from '../core/services/audio.service';
import { PlayerComponent } from "../features/player/player.component";

@Component({
	selector: 'app-demo',
	standalone: true,
	templateUrl: './demo.html',
	styleUrl: './demo.scss',
 imports: [RoomComponent, PlayerComponent], 

})
export class Demo {
	private audioService: AudioService = inject(AudioService);

	ngOnInit() {
		this.audioService.playAmbientMusic();
	}

	ngOnDestroy() {
		this.audioService.stopAmbientMusic();
	}
}
