import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Npc } from './npc.store';
import { SpriteComponent } from 'src/app/shared/sprite/sprite.component';
import { NPC_CONFIG } from './npc-types';

@Component({
    selector: 'app-npc',
    standalone: true,
    imports: [SpriteComponent],
    templateUrl: './npc.component.html',
    styleUrl: './npc.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NpcComponent {
    public npc = input.required<Npc>();

    public spriteType = computed(() => NPC_CONFIG[this.npc().type].spriteType);
}
