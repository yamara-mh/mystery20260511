/**
 * Procedural asset generator.
 * Creates placeholder images using Canvas API so the game is playable without external assets.
 */

function createCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export function generateBackground(
  name: string,
  colors: string[],
  label?: string
): string {
  const c = createCanvas(1280, 720);
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 720);
  colors.forEach((color, i) => {
    grad.addColorStop(i / Math.max(colors.length - 1, 1), color);
  });
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1280, 720);

  // Add subtle grid pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1280; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 720);
    ctx.stroke();
  }
  for (let y = 0; y < 720; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label ?? name, 640, 40);

  return c.toDataURL('image/png');
}

export function generateCharacter(
  name: string,
  color: string,
  emotion: string
): string {
  const c = createCanvas(400, 600);
  const ctx = c.getContext('2d')!;

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(200, 400, 100, 200, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  const headColor = lightenColor(color, 40);
  ctx.fillStyle = headColor;
  ctx.beginPath();
  ctx.arc(200, 180, 80, 0, Math.PI * 2);
  ctx.fill();

  // Eyes based on emotion
  ctx.fillStyle = '#333';
  const eyeY = 170;
  switch (emotion) {
    case 'angry':
      ctx.fillRect(160, eyeY - 5, 25, 8);
      ctx.fillRect(215, eyeY - 5, 25, 8);
      // Angry eyebrows
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(155, eyeY - 20);
      ctx.lineTo(185, eyeY - 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(245, eyeY - 20);
      ctx.lineTo(215, eyeY - 12);
      ctx.stroke();
      break;
    case 'sad':
      ctx.beginPath();
      ctx.arc(172, eyeY, 8, 0, Math.PI * 2);
      ctx.arc(228, eyeY, 8, 0, Math.PI * 2);
      ctx.fill();
      // Sad mouth
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(200, 230, 20, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
      break;
    case 'surprised':
      ctx.beginPath();
      ctx.arc(172, eyeY, 12, 0, Math.PI * 2);
      ctx.arc(228, eyeY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = headColor;
      ctx.beginPath();
      ctx.arc(172, eyeY, 6, 0, Math.PI * 2);
      ctx.arc(228, eyeY, 6, 0, Math.PI * 2);
      ctx.fill();
      // Open mouth
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.ellipse(200, 225, 12, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'happy':
      ctx.beginPath();
      ctx.arc(172, eyeY, 8, Math.PI, Math.PI * 2);
      ctx.arc(228, eyeY, 8, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(200, 215, 20, 0, Math.PI);
      ctx.stroke();
      break;
    case 'thinking':
      ctx.beginPath();
      ctx.arc(172, eyeY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = headColor;
      ctx.beginPath();
      ctx.arc(228, eyeY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(228, eyeY, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    default: // normal
      ctx.beginPath();
      ctx.arc(172, eyeY, 8, 0, Math.PI * 2);
      ctx.arc(228, eyeY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(180, 220);
      ctx.lineTo(220, 220);
      ctx.stroke();
      break;
  }

  // Name label
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${name} (${emotion})`, 200, 590);

  return c.toDataURL('image/png');
}

export function generateEvidenceIcon(name: string, color: string): string {
  const c = createCanvas(200, 200);
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#f5f5dc';
  ctx.fillRect(0, 0, 200, 200);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(100, 90, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, 190, 190);

  ctx.fillStyle = '#333';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, 100, 170);

  return c.toDataURL('image/png');
}

function lightenColor(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
