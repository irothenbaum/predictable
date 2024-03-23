import {useEffect, useRef} from 'react'

// this hook handles creating timers (like setTimeout) that cancel when unmounted
function useDoOnceTimer() {
  const timers = useRef({})

  // when we unmount, we cancel all timers
  useEffect(() => {
    return () => cancelAllTimers()
  }, [])

  const setTimer = (key, func, delay) => {
    cancelTimer(key)
    // create a new timer for this key
    timers.current = {
      ...timers.current,
      [key]: setTimeout(() => {
        cancelTimer(key)
        func()
      }, delay),
    }
  }

  const cancelTimer = key => {
    if (isTimerSet(key)) {
      clearTimeout(timers.current[key])
    }

    let newTimers = {...timers.current}
    delete newTimers[key]
    timers.current = newTimers
  }

  const cancelAllTimers = () => {
    Object.values(timers.current).forEach(clearTimeout)
    timers.current = {}
  }

  const isTimerSet = key => {
    return typeof timers.current[key] === 'number'
  }

  return {
    isTimerSet,
    setTimer,
    cancelTimer,
    cancelAllTimers,
  }
}

export default useDoOnceTimer
