import React from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import { CodeScannerFrame } from 'react-native-vision-camera';

interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Code {
  frame: Frame;
  value?: string;
}

interface Props {
  imageUri: string;
  photoSize: { width: number; height: number };
  codes: Code[];
  scannerFrame?: CodeScannerFrame;
  rotation?: number; // 默认90°
}

export default function DebugPhotoOverlay({
  imageUri,
  photoSize,
  codes,
  scannerFrame,
  rotation = 90,
}: Props) {
  const window = Dimensions.get('window');
  

  const mapFrameToPhoto = ({
    codeFrame,
    scannerFrame,
    photoSize,
    rotation
  }:{
    codeFrame: Frame,
    scannerFrame?: CodeScannerFrame,
    photoSize: { width: number; height: number },
    rotation: number

  }
  ) => {

    if (!scannerFrame) {
      return codeFrame
    }
    const scaleX = photoSize.width / scannerFrame.width;
    const scaleY = photoSize.height / scannerFrame.height;

    return {
      x: codeFrame.y * scaleX,
      y: (scannerFrame.width - codeFrame.x - codeFrame.width) * scaleY,
      width: codeFrame.height * scaleX,
      height: codeFrame.width * scaleY,
    };
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      showsVerticalScrollIndicator
      contentContainerStyle={{
        width: Math.max(photoSize.width, window.width),
        height: Math.max(photoSize.height, window.height),
      }}
      maximumZoomScale={5}
      minimumZoomScale={1}
      style={{ flex: 1, backgroundColor: '#000' }}
    >
      <View
        style={{
          width: scannerFrame?.width,
          height: scannerFrame?.height,
          position: 'relative',
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{
            width: photoSize.width,
            height: photoSize.height,
            position: 'absolute',
          }}
          resizeMode="contain"
        />
        {codes.map((code, idx) => {
          const mapped = mapFrameToPhoto({
           codeFrame: code.frame,
            scannerFrame,
            photoSize,
            rotation
          }
          );
          return (
            <View
              key={idx}
              style={[
                styles.box,
                {
                  left: mapped.x,
                  top: mapped.y,
                  width: mapped.width,
                  height: mapped.height,
                },
              ]}
            >
              <Text style={styles.label}>{code.value || ''}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderColor: '#00FF00',
    borderWidth: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    bottom: -30,
    color: '#00FF00',
    fontSize: 16,
  },
});



