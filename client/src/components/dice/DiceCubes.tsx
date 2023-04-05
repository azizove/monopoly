import React, { useRef } from 'react'
import ReactDice, { ReactDiceRef } from 'react-dice-complete'

export default function DiceCubes() {
  const reactDice = useRef<ReactDiceRef>(null)

  const rollDone = (totalValue: number, values: number[]) => {
    console.log('individual die values array:', values)
    console.log('total dice value:', totalValue)
  }

  const rollAll = () => {
    reactDice.current?.rollAll()
  }

    return (
        <div>
        <ReactDice
            numDice={2}
            ref={reactDice}
            rollDone={rollDone}
            disableIndividual
        />
        <button onClick={rollAll}>Roll All</button>
        </div>
    )

}