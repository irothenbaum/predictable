import React, {useContext, useEffect, useRef} from 'react'
import SettingsContext from '../contexts/SettingsContext'
import {v4 as uuid} from 'uuid'

const BASE_PATH = '/public/sounds/'
export const SOUND_BUZZER = 'buzzer.mp3'

function useSoundPlayer() {
  const {areSoundsMuted} = useContext(SettingsContext)
  const playingSounds = useRef([])

  /**
   * @param {string} soundName
   * @return {string}
   */
  const playSound = soundName => {
    if (areSoundsMuted) {
      return
    }

    const audio = new Audio(`${BASE_PATH}${soundName}`)
    audio.play().catch(e => console.error(e))
    const id = uuid()
    playingSounds.current = {
      ...playingSounds.current,
      [id]: {id: id, name: soundName, audio: audio},
    }
    return id
  }

  /**
   * @param {string} s
   * @returns {void}
   */
  const stopSound = s => {
    if (!s) {
      return
    }

    const sound = playingSounds.current[s]

    if (!sound) {
      return
    }

    sound.stop()

    delete playingSounds.current[s]
  }

  useEffect(() => {
    // when we unmount, we want to stop playing all sounds
    return () => {
      if (playingSounds.current.length > 0) {
        playingSounds.current.forEach(s => s.stop())
      }
    }
  }, [])

  return {
    playSound,
    stopSound,
  }
}

export default useSoundPlayer
