import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import TrackPlayer, { State, useActiveTrack } from 'react-native-track-player'
import tw from 'twrnc'
import { PlayIcon } from 'react-native-heroicons/outline'
import MusicPlayer from './components/music-player'
import { getMusics } from '@/service/music'
import Hyperlink from 'react-native-hyperlink'
const MP3_URL = 'https://cdn.pixabay.com/audio/2021/10/04/audio_8e2f9dbf6b.mp3'
const Music = () => {
  const theme = useTheme()
  const [url, seturl] = useState('')
  const [list, setlist] = useState([])
  const ref = useRef()

  const getRef = () => {
    console.log(ref.current)
  }
  // const addAndPlayTrack = () => {
  //   ref?.current?.addAndPlayTrack()
  // }
  // const pauseMusic = () => {
  //   ref?.current?.pauseMusic()
  // }
  const playItem = () => {
    seturl(MP3_URL)
  }
  const onClosePlayerHandle = () => {
    seturl('')
  }
  const onItemEnd = useCallback(() => {
    console.log('on item end')
  }, [])

  useEffect(() => {
    getMusics().then(res => {
      setlist(res)
    })
  }, [])
  return (
    <View
      style={[tw`flex-1 p-2`, { backgroundColor: theme.colors.background }]}
    >
      {url && (
        <MusicPlayer
          url={url}
          onClose={onClosePlayerHandle}
          onEnd={onItemEnd}
        />
      )}
      <View style={{ flex: 1 }}>
        <ScrollView>
          {list?.length > 0 &&
            list.map((item, index) => (
              <View
                style={[
                  tw` flex-row items-center gap-2 mt-2 py-2 pr-2`,
                  { backgroundColor: theme.colors.secondary },
                ]}
                key={item.id}
              >
                <View style={tw`relative justify-center items-center`}>
                  <Image
                    source={{ uri: item?.sources?.thumbnailUrl }}
                    style={{ width: 80, height: 140 }}
                  />
                  <TouchableOpacity
                    onPress={playItem}
                    style={[
                      tw`absolute  justify-center items-center`,
                      {
                        width: '100%',
                        height: '100%',
                      },
                    ]}
                  >
                    <PlayIcon color={theme.colors.onSecondary} size={22} />
                  </TouchableOpacity>
                </View>
                <View style={[tw`flex-1`]}>
                  <Hyperlink linkDefault={true}>
                    <Text
                      style={[
                        {
                          color: theme.colors.onSecondary,
                          // flexWrap: 'wrap',
                          flexShrink: 1,
                          flexGrow: 1,
                          fontSize: 16,
                          lineHeight: 24,
                          // 确保单词完整换行
                          overflow: 'hidden',
                        },
                      ]}
                    >
                      {item?.name}
                    </Text>
                  </Hyperlink>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
})

export default Music

const MusicPlayerController = (props, ref) => {
  const track = useActiveTrack()
  // useImperativeHandle(ref, () => ({
  //   a: 1,
  //   b: 2,
  //   addAndPlayTrack,
  //   pauseMusic,
  // }))
  const addAndPlayTrack = async () => {
    try {
      // 获取播放器状态
      const state = (await TrackPlayer.getPlaybackState()).state
      const isReady = state === State.Paused || state === State.Stopped
      const url =
        'https://cdn.pixabay.com/audio/2021/10/04/audio_8e2f9dbf6b.mp3'
      const AUDIO =
        'data:audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'

      console.log('isReady::', state)
      if (isReady) {
        // "//m4a-64.jango.com/38/11/91/3811911868308756513.m4a"
        // 添加音轨
        await TrackPlayer.add({
          id: 'trackId',
          url: url || AUDIO,
          title: 'Track Title',
          artist: 'Track Artist',
          // artwork: require('./path/to/your/track/artwork.png'), // 封面图像（可选）
        })
        // track({ url })
        console.log('will play')
        // 播放音轨
        await TrackPlayer.play()
        console.log('audio playing')
        TrackPlayer.setVolume(2)
        // console.log(TrackPlayer.setVolume);
        TrackPlayer.getVolume().then(n => {
          console.log('valume:', n)
        })
      } else {
        console.warn('TrackPlayer is not ready or is already playing.')
      }
    } catch (error) {
      console.error('Error adding or playing track:', error)
    }
  }

  const pauseMusic = async () => {
    await TrackPlayer.pause()
  }

  return (
    <View style={styles.container}>
      <Button onPress={addAndPlayTrack} ref={ref}>
        Play
      </Button>
      <Button onPress={pauseMusic}>Pause</Button>
      {/* <TextInput/> */}
    </View>
  )
}

// const MusicPlayer = forwardRef(MusicPlayerController)
