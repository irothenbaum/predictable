import React from 'react'
import './DailyChallenge.scss'

import {generateLevelDefinition} from '../../lib/generateLevelDefinition'

generateLevelDefinition('test2', {width: 5, height: 5}, 1).then(res => {
  console.log(res)
})

function DailyChallenge(props) {
  return <div className="daily-challenge"></div>
}

export default DailyChallenge
