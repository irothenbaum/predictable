import React from 'react'
import './App.scss'
import PredictableGame from './components/PredictableGame'

import {generateLevelDefinition} from './lib/generateLevelDefinition'

generateLevelDefinition('test12', {width: 5, height: 5}, 1).then(res => {
  console.log(res)
})

function App() {
  return <PredictableGame />
}

export default App
