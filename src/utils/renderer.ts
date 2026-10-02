import { Material, StructuralZone } from '../types';

/**
 * Seeded pseudo-random generator to ensure static, deterministic textures without jitter
 */
function createSeededRandom(seed: number = 42) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Creates dynamic high-resolution texture patterns on an offscreen canvas
 */
export function createMaterialPattern(
  ctx: CanvasRenderingContext2D,
  material: Material,
  targetWidth: number,
  targetHeight: number
): CanvasPattern | null {
  const offscreen = document.createElement('canvas');
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return null;

  const rand = createSeededRandom(
    material.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 100)
  );

  switch (material.textureType) {
    case 'stacked_stone': {
      // 180 x 120 px pattern of varied stone ledger courses
      const pWidth = 180;
      const pHeight = 120;
      offscreen.width = pWidth;
      offscreen.height = pHeight;

      // Base background mortar
      offCtx.fillStyle = '#222326';
      offCtx.fillRect(0, 0, pWidth, pHeight);

      // Ledger stone strips with varied height courses
      const rowHeights = [18, 26, 16, 22, 20, 18];
      let y = 0;
      for (const h of rowHeights) {
        let x = 0;
        while (x < pWidth) {
          const w = 30 + rand() * 45;
          const toneOffset = (rand() - 0.5) * 40;
          const stoneColor = adjustBrightness(material.colorHex, toneOffset);

          // Stone body
          offCtx.fillStyle = stoneColor;
          offCtx.fillRect(x, y, w - 2, h - 2);

          // Subtle horizontal cleft lines for natural stone split-face
          offCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          const cleftCount = Math.floor(h / 7);
          for (let c = 0; c < cleftCount; c++) {
            offCtx.fillRect(x, y + 4 + c * 6, w - 2, 1);
          }

          // Top highlight bevel
          offCtx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          offCtx.fillRect(x, y, w - 2, 1.5);

          // Bottom deep recess shadow
          offCtx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          offCtx.fillRect(x, y + h - 3, w - 2, 1.5);

          // Right end shadow
          offCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          offCtx.fillRect(x + w - 3, y, 1.5, h - 2);

          x += w;
        }
        y += h;
      }
      return ctx.createPattern(offscreen, 'repeat');
    }

    case 'travertine': {
      // Travertine stone slabs with linear veins and refined shadow joints
      const pWidth = 240;
      const pHeight = 120;
      offscreen.width = pWidth;
      offscreen.height = pHeight;

      offCtx.fillStyle = material.colorHex;
      offCtx.fillRect(0, 0, pWidth, pHeight);

      // Horizontal linear sedimentary veining
      for (let i = 0; i < 9; i++) {
        const vy = rand() * pHeight;
        const grad = offCtx.createLinearGradient(0, vy, pWidth, vy + (rand() - 0.5) * 10);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
        grad.addColorStop(0.3, 'rgba(145, 115, 80, 0.18)');
        grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
        grad.addColorStop(1, 'rgba(120, 95, 65, 0.2)');
        offCtx.strokeStyle = grad;
        offCtx.lineWidth = 1 + rand() * 2.5;
        offCtx.beginPath();
        offCtx.moveTo(0, vy);
        offCtx.bezierCurveTo(pWidth * 0.3, vy + 3, pWidth * 0.7, vy - 3, pWidth, vy + 1);
        offCtx.stroke();
      }

      // Micro porous pockets (characteristic of honed travertine)
      offCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let p = 0; p < 40; p++) {
        const px = rand() * pWidth;
        const py = rand() * pHeight;
        offCtx.fillRect(px, py, 1.5 + rand() * 2, 1 + rand() * 1.5);
      }

      // Crisp tile grout joint lines (recessed shadow joints)
      offCtx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
      offCtx.lineWidth = 1.5;
      offCtx.strokeRect(0, 0, pWidth, pHeight);

      // Grout highlight edge
      offCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      offCtx.lineWidth = 1;
      offCtx.strokeRect(1, 1, pWidth - 2, pHeight - 2);

      return ctx.createPattern(offscreen, 'repeat');
    }

    case 'fluted_wood': {
      // 3D fluted vertical wood louvers with rich wood tones
      const slatWidth = 24;
      const slatHeight = 160;
      offscreen.width = slatWidth;
      offscreen.height = slatHeight;

      // Base wood gradient
      const grad = offCtx.createLinearGradient(0, 0, slatWidth, 0);
      grad.addColorStop(0.0, adjustBrightness(material.colorHex, -40));
      grad.addColorStop(0.15, adjustBrightness(material.colorHex, 10));
      grad.addColorStop(0.45, adjustBrightness(material.colorHex, 25));
      grad.addColorStop(0.75, adjustBrightness(material.colorHex, -15));
      grad.addColorStop(1.0, adjustBrightness(material.colorHex, -55));

      offCtx.fillStyle = grad;
      offCtx.fillRect(0, 0, slatWidth, slatHeight);

      // Vertical wood grain lines
      for (let g = 0; g < 4; g++) {
        const gx = 3 + rand() * (slatWidth - 6);
        offCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        offCtx.fillRect(gx, 0, 0.8, slatHeight);
      }

      // Right-edge deep recess cast shadow
      offCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      offCtx.fillRect(slatWidth - 3, 0, 3, slatHeight);

      // Left-edge crisp highlight bevel
      offCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      offCtx.fillRect(0.5, 0, 1.5, slatHeight);

      return ctx.createPattern(offscreen, 'repeat');
    }

    case 'brick': {
      // Running bond masonry
      const pWidth = 100;
      const pHeight = 50;
      offscreen.width = pWidth;
      offscreen.height = pHeight;

      // Mortar background
      offCtx.fillStyle = '#C8C1B3';
      offCtx.fillRect(0, 0, pWidth, pHeight);

      const renderBrick = (bx: number, by: number, bw: number, bh: number) => {
        const brickTone = adjustBrightness(material.colorHex, (rand() - 0.5) * 28);
        offCtx.fillStyle = brickTone;
        offCtx.fillRect(bx, by, bw - 3, bh - 3);

        // Brick texture stipple
        offCtx.fillStyle = 'rgba(0, 0, 0, 0.14)';
        for (let s = 0; s < 10; s++) {
          offCtx.fillRect(bx + rand() * (bw - 5), by + rand() * (bh - 5), 1.5, 1.5);
        }

        // Top highlight & bottom shadow
        offCtx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        offCtx.fillRect(bx, by, bw - 3, 1);
        offCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        offCtx.fillRect(bx, by + bh - 4, bw - 3, 1.5);
      };

      // Top row
      renderBrick(1.5, 1.5, pWidth, 25);
      // Bottom row staggered by half
      renderBrick(1.5, 26.5, pWidth / 2, 25);
      renderBrick(pWidth / 2 + 1.5, 26.5, pWidth / 2, 25);

      return ctx.createPattern(offscreen, 'repeat');
    }

    case 'glass': {
      // Clean architectural glass with subtle sky reflection
      // NO repeated floating hardware clamps!
      const pWidth = 160;
      const pHeight = 120;
      offscreen.width = pWidth;
      offscreen.height = pHeight;

      const grad = offCtx.createLinearGradient(0, 0, pWidth, pHeight);
      grad.addColorStop(0, 'rgba(200, 235, 245, 0.45)');
      grad.addColorStop(0.35, 'rgba(240, 252, 255, 0.7)');
      grad.addColorStop(0.55, 'rgba(180, 225, 240, 0.38)');
      grad.addColorStop(1, 'rgba(165, 215, 230, 0.55)');

      offCtx.fillStyle = grad;
      offCtx.fillRect(0, 0, pWidth, pHeight);

      // Glass vertical panel seam
      offCtx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      offCtx.lineWidth = 1;
      offCtx.strokeRect(0, 0, pWidth, pHeight);

      return ctx.createPattern(offscreen, 'repeat');
    }

    case 'metal_slats': {
      // Horizontal aluminum louvers
      const pWidth = 120;
      const pHeight = 20;
      offscreen.width = pWidth;
      offscreen.height = pHeight;

      offCtx.fillStyle = material.colorHex;
      offCtx.fillRect(0, 0, pWidth, pHeight);

      // Top bevel highlight
      offCtx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      offCtx.fillRect(0, 0, pWidth, 2.5);

      // Bottom deep shadow gap
      offCtx.fillStyle = '#08090A';
      offCtx.fillRect(0, 15, pWidth, 5);

      return ctx.createPattern(offscreen, 'repeat');
    }

    case 'stucco': {
      // Mineral textured stucco with rich stippling
      const pWidth = 80;
      const pHeight = 80;
      offscreen.width = pWidth;
      offscreen.height = pHeight;

      offCtx.fillStyle = material.colorHex;
      offCtx.fillRect(0, 0, pWidth, pHeight);

      // Micro stipples
      for (let s = 0; s < 120; s++) {
        const sx = rand() * pWidth;
        const sy = rand() * pHeight;
        const dark = rand() > 0.45;
        offCtx.fillStyle = dark ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.18)';
        offCtx.fillRect(sx, sy, 1.6, 1.6);
      }
      return ctx.createPattern(offscreen, 'repeat');
    }

    case 'smooth':
    default: {
      // Architectural matte exterior paint finish
      const pWidth = 64;
      const pHeight = 64;
      offscreen.width = pWidth;
      offscreen.height = pHeight;

      offCtx.fillStyle = material.colorHex;
      offCtx.fillRect(0, 0, pWidth, pHeight);

      // Subtle eggshell texture
      for (let s = 0; s < 50; s++) {
        offCtx.fillStyle = rand() > 0.5 ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
        offCtx.fillRect(rand() * pWidth, rand() * pHeight, 1.2, 1.2);
      }
      return ctx.createPattern(offscreen, 'repeat');
    }
  }
}

/**
 * Adjusts HEX color brightness
 */
export function adjustBrightness(hex: string, percent: number): string {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;

  r = Math.min(255, Math.max(0, Math.round(r)));
  g = Math.min(255, Math.max(0, Math.round(g)));
  b = Math.min(255, Math.max(0, Math.round(b)));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Renders the complete renovated house on an HTML5 canvas with realistic lighting
 */
export function renderRenovationCanvas(
  targetCanvas: HTMLCanvasElement,
  imageElement: HTMLImageElement,
  zones: StructuralZone[],
  materialsMap: Map<string, Material>,
  options: {
    showPolygons?: boolean;
    activeZoneId?: string | null;
    hoveredZoneId?: string | null;
    blendIntensity?: number; // 0.0 to 1.0
  } = {}
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const width = targetCanvas.width;
  const height = targetCanvas.height;

  // 1. Draw base photo
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(imageElement, 0, 0, width, height);

  const { showPolygons = false, activeZoneId = null, hoveredZoneId = null } = options;

  // Architectural rendering order: base walls first, projections second, doors and windows on top
  const LAYER_ORDER: Record<string, number> = {
    plinth: 1,
    main_wall: 2,
    accent_wall: 3,
    pillar: 4,
    gate_porch: 5,
    balcony: 6,
    parapet: 7,
    roof_edge: 8,
    railing: 9,
    door: 10,
    window: 11,
  };
  const sortedZones = [...zones].sort(
    (a, b) => (LAYER_ORDER[a.type] || 5) - (LAYER_ORDER[b.type] || 5)
  );

  // 2. Iterate through sorted zones with assigned material
  for (const zone of sortedZones) {
    if (!zone.assignedMaterialId || !zone.polygon || zone.polygon.length < 3) continue;
    const baseMaterial = materialsMap.get(zone.assignedMaterialId);
    if (!baseMaterial) continue;
    const material = zone.customColorHex ? { ...baseMaterial, colorHex: zone.customColorHex } : baseMaterial;

    ctx.save();

    // Clip strictly to zone polygon, punching out any internal window and door openings for walls
    ctx.beginPath();
    const firstPt = zone.polygon[0];
    ctx.moveTo(firstPt[0] * width, firstPt[1] * height);
    for (let i = 1; i < zone.polygon.length; i++) {
      ctx.lineTo(zone.polygon[i][0] * width, zone.polygon[i][1] * height);
    }
    ctx.closePath();

    // If this is a wall surface, carve out all contained window and door openings
    const isWallSurface = zone.type === 'main_wall' || zone.type === 'accent_wall';
    if (isWallSurface) {
      const wallXs = zone.polygon.map((p) => p[0]);
      const wallYs = zone.polygon.map((p) => p[1]);
      const minWX = Math.min(...wallXs);
      const maxWX = Math.max(...wallXs);
      const minWY = Math.min(...wallYs);
      const maxWY = Math.max(...wallYs);

      const openingsToPunch = sortedZones.filter((z) => {
        if (z.type !== 'window' && z.type !== 'door') return false;
        if (!z.polygon || z.polygon.length < 3) return false;
        if (z.parentWallId === zone.id) return true;
        const opXs = z.polygon.map((p) => p[0]);
        const opYs = z.polygon.map((p) => p[1]);
        const cX = (Math.min(...opXs) + Math.max(...opXs)) / 2;
        const cY = (Math.min(...opYs) + Math.max(...opYs)) / 2;
        return cX >= minWX - 0.02 && cX <= maxWX + 0.02 && cY >= minWY - 0.02 && cY <= maxWY + 0.02;
      });

      openingsToPunch.forEach((op) => {
        ctx.moveTo(op.polygon[0][0] * width, op.polygon[0][1] * height);
        for (let j = 1; j < op.polygon.length; j++) {
          ctx.lineTo(op.polygon[j][0] * width, op.polygon[j][1] * height);
        }
        ctx.closePath();
      });

      ctx.clip('evenodd');
    } else {
      ctx.clip();
    }

    // Calculate bounding box
    const minX = Math.min(...zone.polygon.map((p) => p[0])) * width;
    const minY = Math.min(...zone.polygon.map((p) => p[1])) * height;
    const maxX = Math.max(...zone.polygon.map((p) => p[0])) * width;
    const maxY = Math.max(...zone.polygon.map((p) => p[1])) * height;
    const boxW = Math.max(1, maxX - minX);
    const boxH = Math.max(1, maxY - minY);

    // --- DEDICATED ARCHITECTURAL WINDOW CASING & GLAZING REFLECTION ---
    if (zone.type === 'window') {
      const frameColor = zone.customColorHex || material.colorHex || '#1E232A';
      const isFrench = material.id === 'window-french-pane';
      const isArched = material.id === 'window-arched-classic';

      // 1. Sleek Modern Architectural Outer Frame / Reveal Casing
      const frameWidthPx = Math.max(3, Math.min(6, Math.min(boxW, boxH) * 0.05));
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = frameWidthPx;

      if (isArched) {
        // Draw arched window path
        ctx.beginPath();
        const radius = boxW / 2;
        ctx.moveTo(minX, maxY);
        ctx.lineTo(minX, minY + radius);
        ctx.arc(minX + radius, minY + radius, radius, Math.PI, 0, false);
        ctx.lineTo(maxX, maxY);
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.strokeRect(minX + frameWidthPx / 2, minY + frameWidthPx / 2, boxW - frameWidthPx, boxH - frameWidthPx);
      }

      // Subtle drop shadow under top window head
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(minX, minY, boxW, frameWidthPx + 2);

      // 2. Translucent Architectural Low-E Glazing Sheen (preserves real photo depth!)
      const glassX = minX + frameWidthPx;
      const glassY = minY + frameWidthPx;
      const glassW = Math.max(2, boxW - frameWidthPx * 2);
      const glassH = Math.max(2, boxH - frameWidthPx * 2);

      const glassGrad = ctx.createLinearGradient(glassX, glassY, glassX + glassW, glassY + glassH);
      glassGrad.addColorStop(0, 'rgba(180, 220, 240, 0.22)');
      glassGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.28)');
      glassGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.08)');
      glassGrad.addColorStop(1, 'rgba(140, 190, 220, 0.18)');
      ctx.fillStyle = glassGrad;
      ctx.fillRect(glassX, glassY, glassW, glassH);

      // 3. Divided French Lite Grids or standard mullions
      if (isFrench) {
        ctx.fillStyle = frameColor;
        // 2 vertical mullions
        const colW = glassW / 3;
        ctx.fillRect(glassX + colW - 1, glassY, 2.5, glassH);
        ctx.fillRect(glassX + colW * 2 - 1, glassY, 2.5, glassH);
        // 2 horizontal mullions
        const rowH = glassH / 3;
        ctx.fillRect(glassX, glassY + rowH - 1, glassW, 2.5);
        ctx.fillRect(glassX, glassY + rowH * 2 - 1, glassW, 2.5);
      } else if (boxW > boxH * 1.3) {
        // Standard wide casement divider
        ctx.fillStyle = frameColor;
        ctx.fillRect(glassX + glassW / 2 - 1.5, glassY, 3, glassH);
      }

      // Subtle bottom sill
      ctx.fillStyle = adjustBrightness(frameColor, 20);
      ctx.fillRect(minX - 2, maxY, boxW + 4, 3.5);

      ctx.restore();
      continue;
    }

    // --- DEDICATED ARCHITECTURAL ENTRANCE DOOR CASING & FINISH ---
    if (zone.type === 'door') {
      const casingColor = '#1E232A';
      const leafColor = zone.customColorHex || material.colorHex || '#7C4825';
      const isGarage = material.id === 'door-garage-sectional';
      const isDoubleFrench = material.id === 'door-french-double';

      // 1. Outer perimeter jamb casing
      const jambWidth = Math.max(2, Math.min(5, boxW * 0.04));
      ctx.strokeStyle = casingColor;
      ctx.lineWidth = jambWidth;
      ctx.strokeRect(minX + jambWidth / 2, minY + jambWidth / 2, boxW - jambWidth, boxH - jambWidth);

      // 2. Door Leaf Finish with architectural lighting
      const leafX = minX + jambWidth;
      const leafY = minY + jambWidth;
      const leafW = Math.max(2, boxW - jambWidth * 2);
      const leafH = Math.max(2, boxH - jambWidth);

      const pattern = createMaterialPattern(ctx, material, width, height);
      ctx.save();
      ctx.globalAlpha = 0.90 * (options.blendIntensity ?? 0.90);
      if (pattern && material.textureType === 'fluted_wood') {
        ctx.fillStyle = pattern;
        ctx.fillRect(leafX, leafY, leafW, leafH);
      } else {
        ctx.fillStyle = leafColor;
        ctx.fillRect(leafX, leafY, leafW, leafH);
      }

      // If garage door: draw horizontal sectional grooves
      if (isGarage) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        const sectionCount = 4;
        const sHeight = leafH / sectionCount;
        for (let i = 1; i < sectionCount; i++) {
          ctx.fillRect(leafX, leafY + i * sHeight - 1, leafW, 2.5);
        }
        // Top window acrylic strip
        ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';
        ctx.fillRect(leafX + 10, leafY + sHeight * 0.25, leafW - 20, sHeight * 0.4);
      } else if (isDoubleFrench) {
        // Double door center seam
        ctx.fillStyle = '#111827';
        ctx.fillRect(leafX + leafW / 2 - 1.5, leafY, 3, leafH);
        // Glass panels
        ctx.fillStyle = 'rgba(180, 220, 240, 0.35)';
        ctx.fillRect(leafX + 6, leafY + 8, leafW / 2 - 12, leafH - 24);
        ctx.fillRect(leafX + leafW / 2 + 6, leafY + 8, leafW / 2 - 12, leafH - 24);
      } else {
        // Architectural SS vertical pull handle on single pivot door
        const handleX = leafX + leafW * 0.85;
        const handleY = leafY + leafH * 0.35;
        const handleH = leafH * 0.35;
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(handleX, handleY, 3, handleH);
        // Handle cast shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(handleX + 3, handleY + 2, 2, handleH);
      }

      // Multiply photo shadows to maintain realistic lighting
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = 0.35;
      ctx.drawImage(imageElement, 0, 0, width, height);
      ctx.restore();

      // Top jamb cast shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(leafX, leafY, leafW, 4);

      ctx.restore();
      continue;
    }

    // --- ARCHITECTURAL LIGHTING SCONCES ---
    if (material.id === 'lighting-updown-sconce') {
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const fixtureW = Math.max(8, boxW * 0.6);
      const fixtureH = Math.max(16, boxH * 0.8);

      // Warm Radiant Light Cones
      const upGrad = ctx.createRadialGradient(cx, cy - fixtureH / 2, 2, cx, cy - fixtureH, fixtureH * 2.2);
      upGrad.addColorStop(0, 'rgba(255, 230, 150, 0.65)');
      upGrad.addColorStop(0.5, 'rgba(255, 200, 100, 0.25)');
      upGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');
      ctx.fillStyle = upGrad;
      ctx.beginPath();
      ctx.moveTo(cx - fixtureW / 2, cy - fixtureH / 2);
      ctx.lineTo(cx - fixtureW * 2, cy - fixtureH * 2);
      ctx.lineTo(cx + fixtureW * 2, cy - fixtureH * 2);
      ctx.lineTo(cx + fixtureW / 2, cy - fixtureH / 2);
      ctx.closePath();
      ctx.fill();

      const downGrad = ctx.createRadialGradient(cx, cy + fixtureH / 2, 2, cx, cy + fixtureH, fixtureH * 2.5);
      downGrad.addColorStop(0, 'rgba(255, 230, 150, 0.65)');
      downGrad.addColorStop(0.5, 'rgba(255, 200, 100, 0.25)');
      downGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');
      ctx.fillStyle = downGrad;
      ctx.beginPath();
      ctx.moveTo(cx - fixtureW / 2, cy + fixtureH / 2);
      ctx.lineTo(cx - fixtureW * 2.5, cy + fixtureH * 2.5);
      ctx.lineTo(cx + fixtureW * 2.5, cy + fixtureH * 2.5);
      ctx.lineTo(cx + fixtureW / 2, cy + fixtureH / 2);
      ctx.closePath();
      ctx.fill();

      // Modern Matte Black Cylinder Fixture Body
      ctx.fillStyle = '#181A1E';
      ctx.fillRect(cx - fixtureW / 2, cy - fixtureH / 2, fixtureW, fixtureH);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(cx - fixtureW / 2 + 1, cy - fixtureH / 2 + 1, 1.5, fixtureH - 2);

      ctx.restore();
      continue;
    }

    // --- BALCONY GREENERY & PLANTER BOX ---
    if (material.id === 'decor-planter-box') {
      const troughH = Math.max(10, boxH * 0.35);
      const troughY = maxY - troughH;

      // Planter trough container
      ctx.fillStyle = '#262626';
      ctx.fillRect(minX, troughY, boxW, troughH);
      ctx.fillStyle = '#404040';
      ctx.fillRect(minX, troughY, boxW, 2);

      // Lush manicured boxwood green foliage
      const plantH = boxH - troughH;
      const leafCount = Math.max(8, Math.floor(boxW / 12));
      for (let l = 0; l < leafCount; l++) {
        const lx = minX + (l / leafCount) * boxW + 6;
        const rad = 8 + (l % 3) * 3;
        ctx.beginPath();
        ctx.arc(lx, troughY - rad * 0.7, rad, 0, Math.PI * 2);
        ctx.fillStyle = l % 2 === 0 ? '#15803D' : '#16A34A';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lx - 2, troughY - rad * 0.9, rad * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#4ADE80';
        ctx.fill();
      }

      ctx.restore();
      continue;
    }

    // --- STANDARD SURFACES (WALLS, CLADDING, RAILINGS, ETC.) ---
    const pattern = createMaterialPattern(ctx, material, width, height);
    if (pattern) {
      if (material.textureType === 'glass') {
        // Semi-transparent glass balustrade
        ctx.globalAlpha = 0.65;
        ctx.fillStyle = pattern;
        ctx.fillRect(minX, minY, boxW, boxH);

        // Specular diagonal sun reflection streak
        ctx.beginPath();
        const refGrad = ctx.createLinearGradient(minX, minY, maxX, maxY);
        refGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        refGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0.35)');
        refGrad.addColorStop(0.52, 'rgba(255, 255, 255, 0.05)');
        refGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = refGrad;
        ctx.fillRect(minX, minY, boxW, boxH);

        // Top handrail
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(zone.polygon[0][0] * width, zone.polygon[0][1] * height);
        ctx.lineTo(zone.polygon[1][0] * width, zone.polygon[1][1] * height);
        ctx.stroke();
      } else {
        const intensity = options.blendIntensity ?? 0.88;

        // Pass 1: Render material texture pattern
        ctx.globalAlpha = 0.82 * intensity;
        ctx.fillStyle = pattern;
        ctx.fillRect(minX, minY, boxW, boxH);

        // Pass 2: Multiply photo luminance to preserve building shadows & sunlight depth
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.42;
        ctx.drawImage(imageElement, 0, 0, width, height);

        // Pass 3: Subtle ambient lighting gradient for volumetric realism
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.12;
        const ambGrad = ctx.createLinearGradient(minX, minY, minX, maxY);
        ambGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        ambGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0.32)');
        ctx.fillStyle = ambGrad;
        ctx.fillRect(minX, minY, boxW, boxH);

        // Pass 4: Subtle architectural edge contour
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // 3. Highlight selected or hovered zones if requested
  if (showPolygons || activeZoneId || hoveredZoneId) {
    for (const zone of zones) {
      if (!zone.polygon || zone.polygon.length < 3) continue;
      const isActive = activeZoneId === zone.id;
      const isHovered = hoveredZoneId === zone.id;

      if (!showPolygons && !isActive && !isHovered) continue;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(zone.polygon[0][0] * width, zone.polygon[0][1] * height);
      for (let i = 1; i < zone.polygon.length; i++) {
        ctx.lineTo(zone.polygon[i][0] * width, zone.polygon[i][1] * height);
      }
      ctx.closePath();

      if (isActive) {
        ctx.strokeStyle = '#F59E0B'; // Vibrant architectural amber/gold
        ctx.lineWidth = 3.5;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
        ctx.fill();

        // Draw vertex handles for fine tuning
        for (const pt of zone.polygon) {
          ctx.beginPath();
          ctx.arc(pt[0] * width, pt[1] * height, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      } else if (isHovered) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.fill();
      } else {
        if (zone.type === 'window') {
          ctx.strokeStyle = '#0284C7'; // Crisp sky cyan for windows
          ctx.lineWidth = 2.0;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.fillStyle = 'rgba(2, 132, 199, 0.14)';
          ctx.fill();
        } else if (zone.type === 'door') {
          ctx.strokeStyle = '#EA580C'; // Warm entrance orange for doors
          ctx.lineWidth = 2.0;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.fillStyle = 'rgba(234, 88, 12, 0.16)';
          ctx.fill();
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fill();
        }
      }

      ctx.restore();
    }
  }
}
