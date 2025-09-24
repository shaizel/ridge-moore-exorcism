import { SpriteType } from 'src/app/shared/sprite/sprite-types';
import { Npc, NpcType } from './npc.store';

export interface NpcTypeConfig {
	spriteType: SpriteType;
	/**
	 * The behavior function for this NPC type.
	 * This will be executed by the game loop.
	 */
	action: (npc: Npc) => void;
}

export const NPC_CONFIG: Record<NpcType, NpcTypeConfig> = {
	ghost: {
		spriteType: 'ghost',
		action: (npc: Npc) => { console.log(`Ghost ${npc.id} is acting at`, npc.position); }
	},
	shadow: {
		spriteType: 'shadow',
		action: (npc: Npc) => { console.log(`Shadow ${npc.id} is acting at`, npc.position); }
	}
};
