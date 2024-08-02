import TrackPlayer, {
  Capability,
  Event,
  ServiceHandler,
} from 'react-native-track-player'

const addEventListeners: ServiceHandler = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play())
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause())
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext())
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  )
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop())
}

// Function to set up TrackPlayer
const setupPlayer = async () => {
  await TrackPlayer.setupPlayer()

  // Add the capabilities you want to handle
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
  })
}
export { setupPlayer, addEventListeners }
