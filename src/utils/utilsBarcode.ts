import BarcodeScanning, { BarcodeFormat } from '@react-native-ml-kit/barcode-scanning';

/**
 * 从静态图片识别二维码
 * @param uri 图片本地路径 (file:// 或 content://)
 * @throws 如果没有识别到二维码或检测到多个二维码
 */
export async function scanStaticImage(uri: string): Promise<string> {
  if (!uri) throw new Error('图片路径为空');

  const results = await BarcodeScanning.scan(uri);
  if (results.length === 0) throw new Error('未识别到二维码');
  if (results.length > 1) throw new Error('检测到多个二维码');

  return results[0].value;
}


type Rect = { x: number; y: number; width: number; height: number };
type Size = { width: number; height: number };

interface MapOptions {
  /**
   * resizeMode used for rendering the Image: 'contain' or 'cover'
   */
  resizeMode?: 'contain' | 'cover';
  /**
   * rotationDegrees between photo coordinate system and scannerFrame coordinate system.
   * 0 | 90 | 180 | 270
   */
  rotationDegrees?: 0 | 90 | 180 | 270;
  /**
   * whether the preview (scanner) was mirrored (e.g. front camera).
   */
  mirrored?: boolean;
  /**
   * enable debug logs
   */
  debug?: boolean;
}

/**
 * Map a code frame (in scannerFrame coordinate) -> view/container coordinate.
 *
 * Inputs:
 *  - codeFrame: rectangle relative to scannerFrame (preview) coordinates
 *  - scannerFrame: size of preview frames (the frame used by onCodeScanned)
 *  - photoSize: actual photo width/height (pixels returned by takePhoto)
 *  - viewSize: container (Image) actual layout size
 */
export function mapCodeToView(
  codeFrame: Rect,
  scannerFrame: Size,
  photoSize: Size,
  viewSize: Size,
  opts: MapOptions = {}
): Rect {
  const { resizeMode = 'contain', rotationDegrees = 0, mirrored = false, debug = true } = opts;
  const LOG = debug;

  if (LOG) {
    console.log('mapCodeToView inputs:', { codeFrame, scannerFrame, photoSize, viewSize, resizeMode, rotationDegrees, mirrored });
  }

  // 1) Frame -> Photo
  // Important: codeFrame is expressed in scannerFrame coordinate.
  // We need scale factors from scannerFrame -> photoSize.
  // BUT if scannerFrame orientation differs from photo (e.g., rotated), we must account for rotation.
  // We'll compute an effective photo size aligned with scannerFrame axes.
  let effectivePhotoW = photoSize.width;
  let effectivePhotoH = photoSize.height;

  // If photo is rotated relative to scannerFrame, swap dimensions
  if (rotationDegrees === 90 || rotationDegrees === 270) {
    effectivePhotoW = photoSize.height;
    effectivePhotoH = photoSize.width;
  }

  const scaleF2P_X = effectivePhotoW / scannerFrame.width;
  const scaleF2P_Y = effectivePhotoH / scannerFrame.height;

  const codeOnPhoto = {
    x: codeFrame.x * scaleF2P_X,
    y: codeFrame.y * scaleF2P_Y,
    width: codeFrame.width * scaleF2P_X,
    height: codeFrame.height * scaleF2P_Y,
  };

  if (LOG) {
    console.log('after frame->photo:', { effectivePhotoW, effectivePhotoH, scaleF2P_X, scaleF2P_Y, codeOnPhoto });
  }

  // 2) Photo -> View
  // Compute scale according to resizeMode.
  const scaleX = viewSize.width / effectivePhotoW;
  const scaleY = viewSize.height / effectivePhotoH;
  const scale = resizeMode === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);

  // After scaling, image may be larger than view in one axis (if cover) or smaller (if contain).
  // Compute offset to center the scaled photo in the view
  const displayPhotoW = effectivePhotoW * scale;
  const displayPhotoH = effectivePhotoH * scale;
  const offsetX = (viewSize.width - displayPhotoW) / 2;
  const offsetY = (viewSize.height - displayPhotoH) / 2;

  if (LOG) {
    console.log('photo->view scales:', { scaleX, scaleY, scale, displayPhotoW, displayPhotoH, offsetX, offsetY });
  }

  // 3) Map codeOnPhoto -> view coordinates
  let x = codeOnPhoto.x * scale + offsetX;
  let y = codeOnPhoto.y * scale + offsetY;
  let width = codeOnPhoto.width * scale;
  let height = codeOnPhoto.height * scale;

  // 4) Handle mirrored preview (e.g. front camera)
  // If scanner was mirrored, codeFrame.x was measured in mirrored coordinates; to map to photo we may need mirror correction.
  if (mirrored) {
    // Mirror relative to scannerFrame width, then apply same transforms:
    // codeFrame mirrored x: scannerFrame.width - (codeFrame.x + codeFrame.width)
    const mirroredXOnScanner = scannerFrame.width - (codeFrame.x + codeFrame.width);
    const mirroredXOnPhoto = mirroredXOnScanner * scaleF2P_X;
    const mirroredXOnView = mirroredXOnPhoto * scale + offsetX;
    // Use mirrored x for final
    x = mirroredXOnView;
    if (LOG) console.log('applied mirrored correction', { mirroredXOnScanner, mirroredXOnPhoto, mirroredXOnView });
  }

  // 5) If photoRotation != 0, we must rotate the mapped rectangle appropriately in the view coordinate system.
  // Note: We already swapped effectivePhotoW/H earlier; rotation of coordinates is needed if rotationDegrees != 0
  if (rotationDegrees !== 0) {
    // rotate around photo origin then scale+offset. It's simpler to compute by mapping codeFrame corners.
    // We'll map the 4 corners from scannerFrame->photo->view with rotation applied, then compute bounding box.
    const cornersScanner = [
      { x: codeFrame.x, y: codeFrame.y },
      { x: codeFrame.x + codeFrame.width, y: codeFrame.y },
      { x: codeFrame.x + codeFrame.width, y: codeFrame.y + codeFrame.height },
      { x: codeFrame.x, y: codeFrame.y + codeFrame.height },
    ];

    const mapCorner = (pt: { x: number; y: number }) => {
      // to photo coords (pre-rotation)
      const px = pt.x * scaleF2P_X;
      const py = pt.y * scaleF2P_Y;

      // rotate around photo origin (0,0)
      let rx = px;
      let ry = py;
      const W = photoSize.width;
      const H = photoSize.height;
      if (rotationDegrees === 90) {
        rx = py;
        ry = W - px;
      } else if (rotationDegrees === 180) {
        rx = W - px;
        ry = H - py;
      } else if (rotationDegrees === 270) {
        rx = H - py;
        ry = px;
      }

      // if we swapped effectivePhotoW/H earlier, ensure we map correctly: after rotation, use effectivePhoto dims
      // scale to view and add offsets
      const vx = rx * scale + offsetX;
      const vy = ry * scale + offsetY;
      return { x: vx, y: vy };
    };

    const pts = cornersScanner.map(mapCorner);
    const xs = pts.map(p => p.x);
    const ys = pts.map(p => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    x = minX;
    y = minY;
    width = maxX - minX;
    height = maxY - minY;

    if (LOG) console.log('rotation applied, corners->view:', { pts, x, y, width, height });
  }

  // final numeric sanitization
  const result = {
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height),
  };

  if (LOG) console.log('mapCodeToView result:', result);
  return result;
}
