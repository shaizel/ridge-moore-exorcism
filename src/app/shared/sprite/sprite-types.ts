export type AnimationName = "faceS" | "faceW" | "faceE" | "faceN";

export interface SpriteConfig {
	path: string;
	animationCount: number;
	maxFrameCount: number;
	animationHeightPercentage: number;
	animations: Record<
		AnimationName,
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
} as const;

export type SpriteType = keyof typeof SPRITE_CONFIG;
