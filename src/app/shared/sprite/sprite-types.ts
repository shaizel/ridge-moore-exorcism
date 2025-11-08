export interface SpriteConfig {
	path: string;
	animationCount: number;
	maxFrameCount: number;
	animationHeightPercentage: number;
	animations: Record<
		string,
		{
			index: number;
			frameCount: number;
		}
	>;
}

export const SPRITE_CONFIG: Record<string, SpriteConfig> = {
	priest: {
		path: "assets/sprites/priest.png",
		animationCount: 4,
		maxFrameCount: 1,
		animationHeightPercentage: 20,
		animations: {
			faceS: { index: 0, frameCount: 1 },
			faceE: { index: 1, frameCount: 1 },
			faceN: { index: 2, frameCount: 1 },
			faceW: { index: 3, frameCount: 1 },
		},
	},
	ghost: {
		path: "assets/sprites/ghost.png",
		animationCount: 4,
		maxFrameCount: 1,
		animationHeightPercentage: 20,
		animations: {
			faceS: { index: 0, frameCount: 1 },
			faceE: { index: 1, frameCount: 1 },
			faceN: { index: 2, frameCount: 1 },
			faceW: { index: 3, frameCount: 1 },
		},
	},
	shadow: {
		path: "assets/sprites/shadow.png",
		animationCount: 4,
		maxFrameCount: 1,
		animationHeightPercentage: 20,
		animations: {
			faceS: { index: 0, frameCount: 1 },
			faceE: { index: 1, frameCount: 1 },
			faceN: { index: 2, frameCount: 1 },
			faceW: { index: 3, frameCount: 1 },
		},
	},
	doorE: {
		path: "assets/sprites/doorE.png",
		animationCount: 2,
		maxFrameCount: 6,
		animationHeightPercentage: 20,
		animations: {
			closed: { index: 0, frameCount: 1 },
			open: { index: 1, frameCount: 1 },
			closing: { index: 0, frameCount: 6 },
			opening: { index: 1, frameCount: 6 },
		},
	},
} as const;

export type SpriteType = keyof typeof SPRITE_CONFIG;
