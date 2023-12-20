import {useEffect, useRef} from 'react'

function useKeyListener(callback) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleKeyDown = e => {
      if (typeof callbackRef.current === 'function') {
        if (callbackRef.current(e.key)) {
          e.preventDefault()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

export default useKeyListener
