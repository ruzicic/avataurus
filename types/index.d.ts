export interface AvatarOptions {
  size?: number;
  variant?: 'face' | 'initial';
  colors?: string[];
}

export function generateAvatar(seed: string, options?: AvatarOptions): string;
export function fnv1a(str: string): number;
export default generateAvatar;