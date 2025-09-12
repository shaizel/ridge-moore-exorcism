export type SpriteType = 'player';
export type AnimationName = 'faceS' | 'faceW' | 'faceE' | 'faceN';

export interface SpriteConfig {
  path: string;
  frameWidth: number;
  frameHeight: number;
  animations: Record<
    AnimationName,
    {
      row: number;
      frames: number;
    }
  >;
}

export const SPRITE_CONFIG: Record<SpriteType, SpriteConfig> = {
  player: {
    path: 'assets/sprites/player.png',
    frameWidth: 64,
    frameHeight: 64,
    animations: {
      faceS: { row: 0, frames: 1 },
      faceW: { row: 1, frames: 1 },
      faceE: { row: 2, frames: 1 },
      faceN: { row: 3, frames: 1 },
    },
  },
};
