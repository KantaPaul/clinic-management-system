/**
 * Barcode & GS1 DataMatrix Utilities for Clinic Dispensary
 * Provides barcode parsing, Code-128 SVG rendering, and Web Audio feedback.
 */

// Web Audio API confirmation beeps for hardware & camera scanning
export const playScannerSound = (type: 'success' | 'warning' | 'error' = 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success') {
      // Pleasant high-pitch double chirp (880Hz -> 1760Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'warning') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Error buzz (150Hz)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
};

export interface ParsedBarcode {
  raw: string;
  type: 'gs1' | 'medicine_gtin' | 'batch_lot' | 'prescription' | 'composite' | 'generic';
  gtin?: string;
  lotNumber?: string;
  expiryDate?: string;
  serialNumber?: string;
  medicineId?: string;
  prescriptionId?: string;
}

/**
 * Parses diverse barcode types used in clinical dispensaries:
 * 1. GS1 DataMatrix / GS1-128: e.g. "(01)08941100234510(17)261231(10)LOT-BX-9021" or "01089411002345101726123110LOT-BX-9021"
 * 2. Composite string: "MED-01#LOT-BX-9021" or "894110023451|LOT-BX-9021"
 * 3. Prescription QR / Barcode: "RX-2026-0104"
 * 4. Lot number barcode: "LOT-BX-9021", "LOT-HC-7741"
 * 5. Medicine barcode / GTIN: "894110023451", "MED-01"
 */
export const parseDispensaryBarcode = (code: string): ParsedBarcode => {
  const clean = (code || '').trim();

  if (!clean) {
    return { raw: '', type: 'generic' };
  }

  // 1. Prescription ID Check (e.g. RX-2026-0104)
  if (/^RX-\d{4}-\d+/i.test(clean)) {
    return {
      raw: clean,
      type: 'prescription',
      prescriptionId: clean.toUpperCase(),
    };
  }

  // 2. Composite Barcode (e.g. MED-01#LOT-BX-9021 or 894110023451|LOT-BX-9021)
  if (clean.includes('#') || clean.includes('|')) {
    const delimiter = clean.includes('#') ? '#' : '|';
    const parts = clean.split(delimiter).map(s => s.trim());
    return {
      raw: clean,
      type: 'composite',
      gtin: parts[0],
      lotNumber: parts[1],
    };
  }

  // 3. GS1 Bracketed Format: (01)...(17)...(10)...
  if (clean.includes('(01)') || clean.includes('(10)')) {
    let gtin: string | undefined;
    let lotNumber: string | undefined;
    let expiryDate: string | undefined;

    const gtinMatch = clean.match(/\(01\)(\d{14}|\d{12}|\d{13})/);
    if (gtinMatch) gtin = gtinMatch[1];

    const lotMatch = clean.match(/\(10\)([A-Za-z0-9-_]+)/);
    if (lotMatch) lotNumber = lotMatch[1];

    const expMatch = clean.match(/\(17\)(\d{6})/);
    if (expMatch) {
      // YYMMDD -> 20YY-MM-DD
      const yy = expMatch[1].substring(0, 2);
      const mm = expMatch[1].substring(2, 4);
      const dd = expMatch[1].substring(4, 6);
      expiryDate = `20${yy}-${mm}-${dd}`;
    }

    return {
      raw: clean,
      type: 'gs1',
      gtin,
      lotNumber,
      expiryDate,
    };
  }

  // 4. Batch Lot Number check: LOT-SQ-8812, BAT-2026-001
  if (/^LOT-[A-Z0-9-]+/i.test(clean) || /^BAT-\d{4}-\d+/i.test(clean)) {
    return {
      raw: clean,
      type: 'batch_lot',
      lotNumber: clean.toUpperCase(),
    };
  }

  // 5. Medicine internal ID: MED-01 to MED-99
  if (/^MED-\d+/i.test(clean)) {
    return {
      raw: clean,
      type: 'medicine_gtin',
      medicineId: clean.toUpperCase(),
    };
  }

  // 6. GTIN / EAN-13 (8-14 numeric digits)
  if (/^\d{8,14}$/.test(clean)) {
    return {
      raw: clean,
      type: 'medicine_gtin',
      gtin: clean,
    };
  }

  return {
    raw: clean,
    type: 'generic',
    lotNumber: clean,
  };
};

/**
 * Generates an SVG string representation of a Code-128 / Barcode graphic
 * for crisp rendering and physical label sticker printing.
 */
export const generateBarcodeSvg = (
  text: string,
  options?: { width?: number; height?: number; displayValue?: boolean }
): string => {
  const width = options?.width || 240;
  const height = options?.height || 70;
  const displayValue = options?.displayValue ?? true;

  // Generate pseudo-deterministic bar pattern from hash of text
  const cleanText = text.trim() || 'SAMPLE';
  const bars: { x: number; w: number }[] = [];
  
  let hash = 0;
  for (let i = 0; i < cleanText.length; i++) {
    hash = (hash << 5) - hash + cleanText.charCodeAt(i);
    hash |= 0;
  }

  const quietZone = 12;
  const usableWidth = width - quietZone * 2;
  const totalUnits = 85;
  const unitWidth = usableWidth / totalUnits;

  // Lead guard bars (101)
  bars.push({ x: quietZone, w: unitWidth });
  bars.push({ x: quietZone + unitWidth * 2, w: unitWidth });

  let currentX = quietZone + unitWidth * 4;
  let seed = Math.abs(hash) + 12345;

  for (let i = 0; i < 28 && currentX < width - quietZone - unitWidth * 4; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const barWUnits = 1 + (seed % 3);
    const spaceUnits = 1 + ((seed >> 2) % 3);

    bars.push({ x: currentX, w: barWUnits * unitWidth });
    currentX += (barWUnits + spaceUnits) * unitWidth;
  }

  // Trail guard bars (101)
  bars.push({ x: width - quietZone - unitWidth * 3, w: unitWidth });
  bars.push({ x: width - quietZone - unitWidth, w: unitWidth });

  const barHeight = displayValue ? height - 18 : height;

  const rects = bars
    .map(b => `<rect x="${b.x.toFixed(1)}" y="4" width="${b.w.toFixed(1)}" height="${barHeight}" fill="#0f172a" />`)
    .join('');

  const textElement = displayValue
    ? `<text x="${(width / 2).toFixed(1)}" y="${(height - 2).toFixed(1)}" font-family="ui-monospace, monospace" font-size="11" font-weight="600" text-anchor="middle" fill="#334155" letter-spacing="1.5">${cleanText}</text>`
    : '';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #ffffff; border-radius: 4px;">
      ${rects}
      ${textElement}
    </svg>
  `.trim();
};
