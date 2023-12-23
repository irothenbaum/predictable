import React, {useEffect, useState} from 'react'
import "./SlideReveal.scss
import useReadyTimer from "../../hooks/useReadyTimer";
import {constructClassString} from "../../lib/utilities";
import useDoOnceTimer from "../../hooks/useDoOnceTimer";
import PropTypes from "prop-types";

function SlideReveal(props){
  const {isReady} = useReadyTimer()
  const {isRevealed, setIsRevealed} = useState(false)
  const {setTimer} = useDoOnceTimer()

  useEffect(() => {
    setTimer("reveal-timer", () => setIsRevealed(true), props.delay)
  }, []);

  return isRevealed ? <React.Fragment>{props.children}</React.Fragment> : (
    <div className={constructClassString("slide-reveal", {open: isReady})}>
      <div className="slide-reveal-content">
        {props.children}
      </div>
    </div>
  )
}

SlideReveal.defaultProps = {
  delay: 500,
}

SlideReveal.propTypes = {
  delay: PropTypes.number,
}

export default SlideReveal
