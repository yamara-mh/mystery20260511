/** Responsive layout utilities */

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

export interface LayoutInfo {
  scale: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait';
}

export function calculateLayout(
  containerWidth: number,
  containerHeight: number
): LayoutInfo {
  const orientation =
    containerWidth >= containerHeight ? 'landscape' : 'portrait';

  let width: number;
  let height: number;

  if (orientation === 'landscape') {
    const containerAspect = containerWidth / containerHeight;
    if (containerAspect > ASPECT_RATIO) {
      height = containerHeight;
      width = height * ASPECT_RATIO;
    } else {
      width = containerWidth;
      height = width / ASPECT_RATIO;
    }
  } else {
    width = containerWidth;
    height = width / ASPECT_RATIO;
    if (height > containerHeight * 0.6) {
      height = containerHeight * 0.6;
      width = height * ASPECT_RATIO;
    }
  }

  const scale = width / GAME_WIDTH;
  const offsetX = (containerWidth - width) / 2;
  const offsetY = orientation === 'landscape'
    ? (containerHeight - height) / 2
    : 0;

  return { scale, offsetX, offsetY, width, height, orientation };
}
