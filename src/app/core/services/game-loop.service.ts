import { Injectable, OnDestroy, effect, inject } from '@angular/core';
import { GameStore } from '../game.store';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameLoopService implements OnDestroy {
	private gameStore = inject(GameStore);

	private loopId?: ReturnType<typeof setInterval>;

	private tickSubject = new Subject<void>();
	public tickObservable = this.tickSubject.asObservable();

	constructor() {
		// When the game speed changes in the store, restart the loop
		// to apply the new speed.
		effect(() => {
			this.gameStore.gameSpeedMs(); // Depend on the signal
			if (this.loopId) {
				this.restart();
			}
		});
	}

	public start(): void {
		if (this.loopId) {
			return; // Loop is already running
		}

		this.loopId = setInterval(() => {
			this.tick();
		}, this.gameStore.gameSpeedMs());
	}

	public stop(): void {
		clearInterval(this.loopId);
		this.loopId = undefined;
	}

	private restart(): void {
		this.stop();
		this.start();
	}

	private tick(): void {
		this.tickSubject.next();
	}

	ngOnDestroy(): void {
		this.stop();
	}
}