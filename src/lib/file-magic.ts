/**
 * Magic-byte based image type detection.
 *
 * Prüft die ersten Bytes eines Buffers, um Bild-Formate zuverlässiger zu erkennen
 * als über den (leicht fälschbaren) MIME-Type des Uploads. Verwendet für den
 * Datei-Upload-Fluss:
 *   1) Content-Length Header prüfen (bevor formData konsumiert wird)
 *   2) File in Buffer streamen
 *   3) detectImageType() aufrufen und gegen ALLOWED_TYPES vergleichen
 *   4) Bei mismatch: 415 Unsupported Media Type
 */

export type ImageType = 'jpg' | 'png' | 'webp' | 'heic'

/** Prüft, ob `buffer` mit der Byte-Sequenz `signature` beginnt (ab `offset`). */
function startsWith(buffer: Uint8Array, signature: number[], offset = 0): boolean {
  if (buffer.length < offset + signature.length) return false
  for (let i = 0; i < signature.length; i++) {
    if (buffer[offset + i] !== signature[i]) return false
  }
  return true
}

/**
 * Erkennt Bild-Format anhand der ersten Bytes.
 * Rückgabewert `null` = unbekannt/unsupported.
 */
export async function detectImageType(buffer: ArrayBuffer): Promise<ImageType | null> {
  const bytes = new Uint8Array(buffer)
  if (bytes.length < 12) return null

  // JPEG: FF D8 FF
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'jpg'

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png'

  // WebP: "RIFF" ???? "WEBP" (52 49 46 46 xx xx xx xx 57 45 42 50)
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return 'webp'
  }

  // HEIC/HEIF: "....ftypheic" | "....ftypheix" | "....ftypmif1" | "....ftypmsf1" | "....ftypheim" | "....ftypheis"
  // Positions 4-7: "ftyp", Positions 8-11: brand
  if (startsWith(bytes, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
    const heicBrands = new Set(['heic', 'heix', 'mif1', 'msf1', 'heim', 'heis', 'hevc', 'hevx'])
    if (heicBrands.has(brand)) return 'heic'
  }

  return null
}
