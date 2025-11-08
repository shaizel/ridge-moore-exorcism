import { Injectable, inject } from '@angular/core';
import { Position } from '../../features/characters/player/player.store';
import { RoomObject, RoomStore } from '../../features/room/room.store';
import { GRID_CELL_BLOCKED, GRID_HEIGHT, GRID_WIDTH } from './constants';
import { Grid } from '../interfaces/inerfaces';
import { Npc, NpcStore } from 'src/app/features/characters/npc/npc.store';

@Injectable({providedIn: 'root'})
export class PathService {
	private roomStore = inject(RoomStore);
	private npcStore = inject(NpcStore);

	constructor() { }

	/**
	 * Calculates the movement cost from a starting position to all other reachable cells on the grid.
	 * @param start The starting position.
	 * @param maxRange An optional maximum range to calculate scores for. Cells beyond this range will be `Infinity`.
	 * @returns A 2D array where each cell's value is its distance from the start.
	 */
	public getScoredGrid(start: Position, ignoreObstacles: boolean = false, maxRange: number = Infinity): Grid {
		const grid: Grid = this.initializeGrid(ignoreObstacles);

		const openSet: Position[] = [start];
		grid[start.x][start.y] = 0;

		let head = 0;
		while (head < openSet.length) {
			const currentPos = openSet[head++];
			const currentScore = grid[currentPos.x][currentPos.y];

			if (currentScore >= maxRange) {
				continue;
			}

			const neighbors = this.getNeighbors(currentPos, grid);
			for (const neighborPos of neighbors) {
				if (grid[neighborPos.x][neighborPos.y] === Infinity) {
					grid[neighborPos.x][neighborPos.y] = currentScore + 1;
					openSet.push(neighborPos);
				}
			}
		}

		return grid;
	}

	public findPath(grid: Grid, destination: Position): Position[] {
		// Validate destination is within bounds and not on an obstacle
		if (this.isInvalidPosition(destination, grid)) {
			console.warn('Destination is invalid or an obstacle.');
			return [];
		}

		// Use the scored grid to reconstruct the path from the destination.
		return this.reconstructPath(grid, destination);
	}

	private initializeGrid(ignoreObstacles: boolean = false): Grid {
		const grid: Grid = Array.from({ length: GRID_WIDTH }, () => Array(GRID_HEIGHT).fill(Infinity));
		const objects: RoomObject[] = this.roomStore.objects();
		const npcs: Npc[] = this.npcStore.npcs();

		// Block cells for solid room objects
		for (const object of objects) {
			if ((!ignoreObstacles && object.isSolid) && !this.isOutOfBounds(object.position)) {
				grid[object.position.x][object.position.y] = GRID_CELL_BLOCKED;
			}
		}

		// Block cells for solid NPCs
		for (const npc of npcs) {
			if (!this.isOutOfBounds(npc.position)) {
				grid[npc.position.x][npc.position.y] = GRID_CELL_BLOCKED;
			}
		}

		return grid;
	}

	private getNeighbors(pos: Position, grid: Grid): Position[] {
		const neighbors: Position[] = [];
		const { x, y } = pos;
		const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }]; // N, S, W, E

		for (const dir of directions) {
			const newPos = { x: x + dir.x, y: y + dir.y };
			if (!this.isInvalidPosition(newPos, grid)) {
				neighbors.push(newPos);
			}
		}
		return neighbors;
	}

	private isOutOfBounds(pos: Position): boolean {
		return pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT;
	}

	private isInvalidPosition(pos: Position, grid: Grid): boolean {
		return this.isOutOfBounds(pos) || grid[pos.x][pos.y] === GRID_CELL_BLOCKED;
	}

	private reconstructPath(grid: Grid, destination: Position): Position[] {
		if (grid[destination.x][destination.y] === Infinity) {
			return []; // Destination is not reachable
		}

		const path: Position[] = [];
		let currentPos = destination;

		while (grid[currentPos.x][currentPos.y] !== 0) {
			path.unshift(currentPos);
			const currentScore = grid[currentPos.x][currentPos.y];
			const neighbors = this.getNeighbors(currentPos, grid);

			// Find the neighbor that leads back to the start (score is one less)
			const nextStep = neighbors.find((neighbor) => grid[neighbor.x][neighbor.y] === currentScore - 1);

			if (!nextStep) {
				// This should not happen if a path exists, but as a safeguard...
				console.error('Path reconstruction failed: could not find next step from', currentPos);
				return []; // or throw an error
			}

			currentPos = nextStep;
		}

		return path;
	}
}