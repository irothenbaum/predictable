import {useEffect, useRef} from 'react'

function useKeyListener(callback) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleKeyDown = e => {
      if (typeof callbackRef.current === 'function') {
        callbackRef.current(e.key)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

export default useKeyListener
