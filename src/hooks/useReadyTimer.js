import {useEffect, useRef, useState} from 'react'
import useDoOnceTimer from './useDoOnceTimer'

const READY_TIMER = 'ready-timer'
const DEFAULT_READY_DELAY = 500

function useReadyTimer(readyDelay) {
  const [isReady, setIsReady] = useState(false)
  const readyDelayRef = useRef(
    typeof readyDelay === 'number' ? readyDelay : DEFAULT_READY_DELAY,
  )
  const {setTimer} = useDoOnceTimer()

  useEffect(() => {
    if (isReady) {
      return
    }
    setTimer(READY_TIMER, () => setIsReady(true), readyDelayRef.current)
  }, [isReady])

  return {
    isReady,
    resetReadyTimer: delay => {
      if (typeof delay === 'number') {
        readyDelayRef.current = delay
      }
      setIsReady(false)
    },
  }
}

export default useReadyTimer
