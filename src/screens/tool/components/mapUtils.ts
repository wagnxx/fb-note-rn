import { PixelRatio } from 'react-native'
import type { CodeFrame } from 'react-native-vision-camera' // adjust imports if needed
import type { CodeScannerFrame } from 'react-native-vision-camera'

type PreviewSize = { width: number; height: number }
type Rect = { left: number; top: number; width: number; height: number }

/**
 * Map a code.frame (dp, in scannerFrame coords) to preview coords (dp), robustly handling:
 * - scannerFrame (px) -> convert to dp
 * - preview size (dp) possibly different aspect/orientation
 * - resizeMode: 'contain' | 'cover'
 * - 90° rotation between frame and preview
 */
export function mapCodeFrameToPreview(
  codeFrame: CodeFrame, // has x,y,width,height in dp (from useCodeScanner)
  scannerFramePx: CodeScannerFrame, // px
  previewSize: PreviewSize, // dp (from onLayout)
  resizeMode: 'contain' | 'cover' = 'contain',
): Rect {
  // 1) convert scannerFrame px -> dp
  const density = PixelRatio.get()
  const frameDpW = scannerFramePx.width / density
  const frameDpH = scannerFramePx.height / density

  // 2) detect if scannerFrame orientation differs from preview orientation
  const frameIsLandscape = frameDpW >= frameDpH
  const previewIsLandscape = previewSize.width >= previewSize.height
  const rotated = frameIsLandscape !== previewIsLandscape

  // 3) choose scale
  const scale =
    resizeMode === 'contain'
      ? Math.min(
          previewSize.width / (rotated ? frameDpH : frameDpW),
          previewSize.height / (rotated ? frameDpW : frameDpH),
        )
      : Math.max(
          previewSize.width / (rotated ? frameDpH : frameDpW),
          previewSize.height / (rotated ? frameDpW : frameDpH),
        )

  // 4) compute offset (centered)
  const scaledFrameW = (rotated ? frameDpH : frameDpW) * scale
  const scaledFrameH = (rotated ? frameDpW : frameDpH) * scale
  const offsetX = (previewSize.width - scaledFrameW) / 2
  const offsetY = (previewSize.height - scaledFrameH) / 2

  // 5) if rotation, compute rotated coords (90deg clockwise)
  //    Note: rotation direction depends on platform; assuming scannerFrame is landscape (w>h)
  //    and preview is portrait, we map (x,y) in frame to (rotX, rotY) in frame-space matching preview:
  //    For 90deg clockwise: rotX = y; rotY = frameWidthDp - x - width
  //    We'll handle both cases robustly: if rotated true, we perform a 90deg clockwise rotation mapping.
  let localX = codeFrame.x
  let localY = codeFrame.y
  let localW = codeFrame.width
  let localH = codeFrame.height

  if (rotated) {
    // rotate 90deg clockwise within frame dp coords:
    // newX = y
    // newY = frameDpW - x - width
    const rotatedX = localY
    const rotatedY = frameDpW - localX - localW
    const rotatedW = localH
    const rotatedH = localW
    localX = rotatedX
    localY = rotatedY
    localW = rotatedW
    localH = rotatedH
    // after rotation, we will use frameDpH as width and frameDpW as height (handled above)
  }

  // 6) final mapping
  const screenLeft = offsetX + localX * scale
  const screenTop = offsetY + localY * scale
  const screenWidth = localW * scale
  const screenHeight = localH * scale

  return {
    left: screenLeft,
    top: screenTop,
    width: screenWidth,
    height: screenHeight,
  }
}

/**
 * Map corner points (array of {x,y}) to screen coords (dp).
 * corners are in same coordinate system as code.frame (dp).
 */
export function mapCornersToPreview(
  corners: { x: number; y: number }[],
  scannerFramePx: CodeScannerFrame,
  previewSize: PreviewSize,
  resizeMode: 'contain' | 'cover' = 'contain',
) {
  if (!corners || !corners.length) return []
  // reuse frame mapping by mapping each corner as a zero-size rect
  return corners.map(pt =>
    mapCodeFrameToPreview(
      { x: pt.x, y: pt.y, width: 0, height: 0 } as any,
      scannerFramePx,
      previewSize,
      resizeMode,
    ),
  )
}
