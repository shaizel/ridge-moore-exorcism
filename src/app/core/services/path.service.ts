import { Injectable, inject } from '@angular/core';
import { Position } from '../../features/characters/player/player.store';
import { RoomObject, RoomStore } from '../../features/room/room.store';
import { GRID_HEIGHT, GRID_WIDTH } from './constants';

@Injectable({providedIn: 'root'})
export class PathService {
	private roomStore = inject(RoomStore);

	constructor() { }

	/**
	 * Calculates the movement cost from a starting position to all other reachable cells on the grid.
	 * @param start The starting position.
	 * @param maxRange An optional maximum range to calculate scores for. Cells beyond this range will be `Infinity`.
	 * @returns A 2D array where each cell's value is its distance from the start.
	 */
	public getScoredGrid(start: Position, maxRange: number = Infinity): number[][] {
		const objects = this.roomStore.objects();
		const obstacleGrid = this.createGrid(objects);

		const scoredGrid: number[][] = Array.from({ length: GRID_WIDTH }, () =>
			Array(GRID_HEIGHT).fill(Infinity)
		);

		if (this.isInvalidPosition(start, obstacleGrid)) {
			console.warn('Start position is invalid or an obstacle.');
			return scoredGrid;
		}

		const openSet: Position[] = [start];
		scoredGrid[start.x][start.y] = 0;

		let head = 0;
		while (head < openSet.length) {
			const currentPos = openSet[head++];
			const currentScore = scoredGrid[currentPos.x][currentPos.y];

			if (currentScore >= maxRange) {
				continue;
			}

			const neighbors = this.getNeighbors(currentPos, obstacleGrid);
			for (const neighborPos of neighbors) {
				if (scoredGrid[neighborPos.x][neighborPos.y] === Infinity) {
					scoredGrid[neighborPos.x][neighborPos.y] = currentScore + 1;
					openSet.push(neighborPos);
				}
			}
		}

		return scoredGrid;
	}

	public findPath(start: Position, destination: Position): Position[] {
		const obstacleGrid = this.createGrid(this.roomStore.objects());

		// Validate start and destination are within bounds and not on an obstacle
		if (this.isInvalidPosition(start, obstacleGrid) || this.isInvalidPosition(destination, obstacleGrid)) {
			console.warn('Start or destination is invalid or an obstacle.');
			return [];
		}

		// 1. Get the grid of movement scores from the start position.
		const scoredGrid = this.getScoredGrid(start);
		// 2. Use the scored grid to reconstruct the path from the destination.
		return this.reconstructPath(start, destination, obstacleGrid, scoredGrid);
	}

	private createGrid(objects: RoomObject[]): boolean[][] {
		const grid = Array.from({ length: GRID_WIDTH }, () => Array(GRID_HEIGHT).fill(false));
		for (const obj of objects) {
			if (obj.isSolid && !this.isOutOfBounds(obj.position)) {
				grid[obj.position.x][obj.position.y] = true; // true means obstacle
			}
		}
		return grid;
	}

	private getNeighbors(pos: Position, grid: boolean[][]): Position[] {
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

	private isInvalidPosition(pos: Position, grid: boolean[][]): boolean {
		return this.isOutOfBounds(pos) || grid[pos.x][pos.y];
	}

	private reconstructPath(start: Position, destination: Position, obstacleGrid: boolean[][], scoredGrid: number[][]): Position[] {
		if (scoredGrid[destination.x][destination.y] === Infinity) {
			return []; // Destination is not reachable
		}

		const path: Position[] = [];
		let currentPos = destination;

		while (currentPos.x !== start.x || currentPos.y !== start.y) {
			path.unshift(currentPos);
			const currentScore = scoredGrid[currentPos.x][currentPos.y];
			const neighbors = this.getNeighbors(currentPos, obstacleGrid);

			// Find the neighbor that leads back to the start (score is one less)
			const nextStep = neighbors.find(
				(neighbor) => scoredGrid[neighbor.x][neighbor.y] === currentScore - 1
			);
			currentPos = nextStep!; // We know a path exists, so nextStep will be found
		}

		return path;
	}
}