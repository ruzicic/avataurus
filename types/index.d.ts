export interface AvatarOptions {
  size?: number;
  colors?: [string, string, string, string];
  showInitial?: boolean;
  variant?: 'gradient' | 'solid';
}

export function generateAvatar(name: string, options?: AvatarOptions): string;
export function fnv1a(str: string): number;
export default generateAvatar;
