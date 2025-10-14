import { SpriteType } from 'src/app/shared/sprite/sprite-types';
import { Npc } from './npc.store';
import { AudioService } from 'src/app/core/services/audio.service';

export interface NpcConfig {
	spriteType: SpriteType;
	portrait: string;
	// Returns true when turn is completed in the current game-loop tick, otherwise, false
	action: (npc: Npc, audioService: AudioService) => Promise<boolean>;
}

export const NPC_CONFIG: Record<string, NpcConfig> = {
	ghost: (() => {
		const initialTickCount = 1;
		let tickCount = initialTickCount;
		return {
			spriteType: 'ghost',
			portrait: 'assets/static/ghost portrait.png',
			action: async (npc: Npc, audioService: AudioService) => {
				tickCount--;
				if (tickCount <= 0) {
					await audioService.playOneShotSound('ghost', npc.position.x, npc.position.y, 1.8);
					tickCount = initialTickCount;
					return true;
				}

				return false;
			},
		};
	})(),
	shadow: (() => {
		const initialTickCount = 1;
		let tickCount = initialTickCount;
		return {
			spriteType: 'shadow',
			portrait: 'assets/static/shadow portrait.png',
			action: async (npc: Npc, audioService: AudioService) => {
				tickCount--;
				if (tickCount <= 0) {
					await audioService.playOneShotSound('shadow', npc.position.x, npc.position.y, 1.8);
					tickCount = initialTickCount;
					return true;
				}

				return false;
			},
		};
	})(),
} as const;

export type NpcType = keyof typeof NPC_CONFIG;
