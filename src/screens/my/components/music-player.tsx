import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player'
import Slider from '@react-native-community/slider'
import { Button, useTheme } from 'react-native-paper'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useThemePaper } from '@/context/theme-provider'

type MusicPlayerProps = {
  url: string
  onClose: () => void
  onEnd?: () => void
}

const MusicPlayer = ({
  url,
  onClose = () => {},
  onEnd = () => {},
}: MusicPlayerProps) => {
  const theme = useTheme()
  const { isDarkMode } = useThemePaper()

  const { position, duration } = useProgress()
  const [volume, setVolume] = useState(0.4)
  const playbackState = usePlaybackState()
  const togglePlayback = async () => {
    const isReady =
      playbackState?.state === State.Paused ||
      playbackState?.state === State.Ready ||
      playbackState?.state === State.Stopped

    // const isPLaying = playbackState.state === State.Playing
    if (isReady) {
      await TrackPlayer.play()
    } else {
      await TrackPlayer.pause()
    }
    console.log('unkown state', playbackState.state)
  }

  const handleVolumeChange = async (value: number) => {
    setVolume(value)
    await TrackPlayer.setVolume(value)
  }
  const onCloseHanlde = () => {
    TrackPlayer.reset()
    onClose()
  }

  useEffect(() => {
    if (State.Ended === playbackState.state) {
      console.log('playbackState:', playbackState.state)
      onEnd()

      TrackPlayer.reset()
    }
  }, [playbackState, onEnd])

  useEffect(() => {
    const AUDIO =
      'data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'

    TrackPlayer.add({
      id: 'trackId',
      url: url || AUDIO,
      title: 'Track Title',
      artist: 'Track Artist',
      // artwork: require('./path/to/your/track/artwork.png'), // 封面图像（可选）
    })
  }, [url])

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={{ alignSelf: 'flex-start' }}>
        <TouchableOpacity onPress={onCloseHanlde}>
          <XMarkIcon size={33} color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Music Player
      </Text>

      <Button
        mode="outlined"
        dark={isDarkMode}
        background={{
          // color: theme.colors.onBackground,
          borderless: true,
          foreground: false,
        }}
        onPress={togglePlayback}
      >
        {playbackState.state === State.Playing ? 'Pause' : 'Play'}
      </Button>

      <Text style={[{ color: theme.colors.onBackground }]}>
        Progress: {Math.floor(position)} / {Math.floor(duration)}
      </Text>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={async value => {
          await TrackPlayer.seekTo(value)
        }}
      />

      <Text style={[{ color: theme.colors.text }]}>
        Volume: {volume.toFixed(2)}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  slider: {
    width: '80%',
    height: 40,
    // marginVertical: 10,
  },
})

export default MusicPlayer
