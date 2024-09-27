import React, { FC, useRef, useState } from 'react'
import { Animated, TouchableOpacity } from 'react-native'
import { SpeakerWaveIcon } from 'react-native-heroicons/outline'
import Tts from 'react-native-tts'

const SpeechButton: FC<{ word: string; isAmerican: boolean }> = ({ word, isAmerican = true }) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const waveAnimation = useRef(new Animated.Value(1)).current

  const speakWord = () => {
    if (!word) return
    setIsSpeaking(true)
    Tts.setDefaultLanguage(isAmerican ? 'en-US' : 'en-GB')
    Tts.speak(word)
    Tts.addEventListener('tts-start', startWaveAnimation)
    Tts.addEventListener('tts-finish', stopWaveAnimation)
  }

  const startWaveAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const stopWaveAnimation = () => {
    waveAnimation.setValue(1)
    setIsSpeaking(false)
  }

  const animatedStyle = {
    transform: [{ scale: waveAnimation }],
  }

  return (
    <TouchableOpacity onPress={speakWord} disabled={isSpeaking}>
      <Animated.View
        style={[
          { width: 16, height: 16 },
          { alignItems: 'center', justifyContent: 'center' },
          animatedStyle,
        ]}
      >
        {/* 这里可以放置你想要的 speaker-wave 图标 */}
        <SpeakerWaveIcon size={14} color={'#666'} />
      </Animated.View>
    </TouchableOpacity>
  )
}

export default SpeechButton
