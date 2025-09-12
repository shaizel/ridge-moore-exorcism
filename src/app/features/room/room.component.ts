import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ROOM_CONFIG, RoomType } from './room-types';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
  /**
   * The type of room to display. This is a required input.
   */
  public roomType = input.required<RoomType>();

  /** A computed signal to get the room's configuration data based on its type. */
  public roomData = computed(() => ROOM_CONFIG[this.roomType()]);
}
