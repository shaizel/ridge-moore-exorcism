import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameViewComponent { }
