import {useState, useRef, useEffect} from 'react'

function useDoOnceTimer() {
  const [timers, setTimers] = useState({})
  const [activeTimers, setTimerKeys] = useState([])

  useEffect(() => {
    setTimerKeys(Object.keys(timers))
  }, [timers, setTimerKeys])

  const setTimer = (key, func, delay) => {
    if (timers[key]) {
      cancelTimer(key)
    }

    setTimers({
      ...timers,
      [key]: setTimeout(() => {
        cancelTimer(key)
        func()
      }, delay),
    })
  }

  const cancelTimer = key => {
    if (isTimerSet(key)) {
      clearTimeout(timers[key])
    }

    let newTimers = {...timers}
    delete newTimers[key]
    setTimers(newTimers)
  }

  const cancelAllTimers = () => {
    Object.values(timers).forEach(clearTimeout)
    setTimers({})
  }

  const isTimerSet = key => {
    return typeof timers[key] === 'number'
  }

  return {
    activeTimers,
    isTimerSet,
    setTimer,
    cancelTimer,
    cancelAllTimers,
  }
}

export default useDoOnceTimer
