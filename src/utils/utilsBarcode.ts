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
