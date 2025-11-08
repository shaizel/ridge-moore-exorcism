import { SpriteType } from 'src/app/shared/sprite/sprite-types';
import { Npc, NpcStore } from './npc.store';
import { AudioService } from 'src/app/core/services/audio.service';
import { PathService } from 'src/app/core/services/path.service';
import { PlayerStore, Position } from '../player/player.store';
import { CharacterQueueStore } from '../../game-view/character-queue/character-queue.store';
import { GameStore } from 'src/app/core/game.store';

export interface NpcActionServices {
	audioService: AudioService;
	playerStore: InstanceType<typeof PlayerStore>;
	pathService: PathService;
	npcStore: InstanceType<typeof NpcStore>;
	characterQueueStore: InstanceType<typeof CharacterQueueStore>;
	gameStore: InstanceType<typeof GameStore>;
}

export interface NpcConfig {
	spriteType: SpriteType;
	portrait: string;
	// Returns true when turn is completed in the current game-loop tick, otherwise, false
	action: (npc: Npc, services: NpcActionServices) => void;
}

function getDirectionForMove(current: Position, next: Position): string {
	const dx = next.x - current.x;
	const dy = next.y - current.y;
	if (dx > 0) return 'faceE';
	if (dx < 0) return 'faceW';
	if (dy > 0) return 'faceS';
	if (dy < 0) return 'faceN';
	return 'faceS'; // Should not happen if moving
}

export const NPC_CONFIG: Record<string, NpcConfig> = {
	ghost: (() => {
		let path: Position[] | null = null;
		let soundPromise: Promise<void>;

		return {
			spriteType: 'ghost',
			portrait: 'assets/static/ghost portrait.png',
			action: async (npc: Npc, { audioService, playerStore, pathService, npcStore, characterQueueStore, gameStore }: NpcActionServices) => {
				if (path === null) {
					const playerPosition = playerStore.position();
					const scoredGrid = pathService.getScoredGrid(npc.position, true);
					// Find the full path, but only keep the first 3 steps for this turn.
					path = pathService.findPath(scoredGrid, playerPosition).slice(0, 3);
					soundPromise = audioService.playOneShotSound('ghost', npc.position.x, npc.position.y, 1.8);
				}

				// If the path is already 0, don't do anything in this action call
				if (path.length === 0) {
					return;
				}

				if (path.length > 0) {
					const nextStep = path.shift()!;
					const direction = getDirectionForMove(npc.position, nextStep);
					npcStore.moveNpc(npc.id, nextStep, direction);
				}

				// If the path is now empty, wait for async actions to finish and move to the next player
				if (path.length === 0) {
					const npcPosition = npcStore.npcs().find((entry) => entry.id === npc.id)!.position;
					if (npcPosition.x === playerStore.position().x && npcPosition.y === playerStore.position().y) {
						gameStore.gameOverLose();
						return;
					}

					await soundPromise.finally(() => {
						characterQueueStore.nextCharacter();
						path = null;
					});
				}
			},
		};
	})(),
	shadow: (() => {
		let path: Position[] | null = null;
		let soundPromise: Promise<void>;

		return {
			spriteType: 'shadow',
			portrait: 'assets/static/shadow portrait.png',
			action: async (npc: Npc, { audioService, playerStore, pathService, npcStore, characterQueueStore, gameStore }: NpcActionServices) => {
				if (path === null) {
					const playerPosition = playerStore.position();
					const scoredGrid = pathService.getScoredGrid(npc.position);
					// Find the full path, but only keep the first 2 steps for this turn.
					path = pathService.findPath(scoredGrid, playerPosition).slice(0, 2);
					soundPromise = audioService.playOneShotSound('shadow', npc.position.x, npc.position.y, 1.8);
				}

				// If the path is already 0, don't do anything in this action call
				if (path.length === 0) {
					return;
				}

				// If the path is not empty, take a step
				if (path.length > 0) {
					const nextStep = path.shift()!;
					const direction = getDirectionForMove(npc.position, nextStep);
					npcStore.moveNpc(npc.id, nextStep, direction);
				}

				// If the path is now empty, wait for async actions to finish and move to the next player
				if (path.length === 0) {
					const npcPosition = npcStore.npcs().find((entry) => entry.id === npc.id)!.position;
					if (npcPosition.x === playerStore.position().x && npcPosition.y === playerStore.position().y) {
						gameStore.gameOverLose();
						return;
					}

					await soundPromise.finally(() => {
						characterQueueStore.nextCharacter();
						path = null;
					});
				}
			},
		};
	})(),
} as const;

export type NpcType = keyof typeof NPC_CONFIG;
