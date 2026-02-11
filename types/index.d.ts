export interface AvatarOptions {
  size?: number;
  colors?: [string, string, string, string];
  showInitial?: boolean;
  variant?: 'gradient' | 'solid';
  mood?: 'happy' | 'angry' | 'sleepy' | 'surprised' | 'chill' | null;
  species?: 'rex' | 'triceratops' | 'stego' | 'raptor' | 'bronto' | null;
}

export function generateAvatar(name: string, options?: AvatarOptions): string;
export function fnv1a(str: string): number;
export default generateAvatar;
