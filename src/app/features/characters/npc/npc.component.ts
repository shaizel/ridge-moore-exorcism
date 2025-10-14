import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Npc } from './npc.store';
import { SpriteComponent } from 'src/app/shared/sprite/sprite.component';
import { NPC_CONFIG } from './npc-types';
import { CharacterQueueStore } from '../../game-view/character-queue/character-queue.store';

@Component({
    selector: 'app-npc',
    standalone: true,
    imports: [SpriteComponent],
    templateUrl: './npc.component.html',
    styleUrl: './npc.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NpcComponent {
    public characterQueueStore = inject(CharacterQueueStore);


    public npc = input.required<Npc>();

    public spriteType = computed(() => NPC_CONFIG[this.npc().type].spriteType);
}
