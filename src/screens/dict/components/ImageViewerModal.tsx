import React, { useState, useEffect, useMemo } from 'react'
import {
  Modal,
  View,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'

const { width, height } = Dimensions.get('window')

interface ImageViewerModalProps {
  imageUrls: string[] // 一组图片的 URL
  visible: boolean // 模态框是否显示
  onClose: (visible: boolean) => void // 关闭模态框的回调
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ imageUrls, visible, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(true) // Track loading state

  const currentImageUrl = useMemo(() => {
    return currentIndex < 0 ? '' : imageUrls[currentIndex]
  }, [currentIndex, imageUrls])

  useEffect(() => {
    const sclae = 2 // This scale could be adjustable based on device resolution or user preference
    if (!currentImageUrl) return

    // Reset loading state when switching images
    setIsLoading(true)

    Image.getSize(
      currentImageUrl,
      (w, h) => {
        setImageDimensions({ width: w * sclae, height: h * sclae })
      },
      err => {
        console.log('Image load error:', err)
      },
    )
  }, [currentImageUrl, currentIndex])

  const handleImageLoad = () => {
    setIsLoading(false) // Image is loaded
  }

  const prevImage = () => {
    setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : imageUrls.length - 1))
  }

  const nextImage = () => {
    setCurrentIndex(prevIndex => (prevIndex < imageUrls.length - 1 ? prevIndex + 1 : 0))
  }

  return (
    <Modal visible={visible} onRequestClose={() => onClose(false)} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <ImageZoom
          cropWidth={width}
          cropHeight={height}
          imageWidth={imageDimensions.width}
          imageHeight={imageDimensions.height}
          minScale={0.1}
          maxScale={10}
          enableCenterFocus
        >
          {/* Show loading indicator until image is loaded */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          <Image
            source={{ uri: currentImageUrl }}
            style={[styles.image, { width: imageDimensions.width, height: imageDimensions.height }]}
            resizeMode="contain"
            onLoad={handleImageLoad} // Trigger loading state change when image is loaded
          />
        </ImageZoom>

        {/* Image navigation buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.navButton, { left: 20 }]}
            onPress={prevImage}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { right: 20 }]}
            onPress={nextImage}
            disabled={currentIndex === imageUrls.length - 1}
          >
            <Text style={styles.navButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Image index and close button */}
        <View style={styles.closeButtonContainer}>
          <Text style={styles.imageIndexText}>
            {currentIndex + 1} / {imageUrls.length}
          </Text>
          <TouchableOpacity onPress={() => onClose(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  image: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: '#333',
  },
  closeButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
  },
  imageIndexText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
})

export default ImageViewerModal
