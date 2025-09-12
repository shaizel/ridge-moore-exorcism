import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpriteComponent } from "../../shared/sprite/sprite.component";

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    SpriteComponent
],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {}
