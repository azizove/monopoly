import React from 'react'

type Props = {
    color: string
}

const Pawn = (props: Props) => {
  return (
    <span style={{fontSize:'50px', color: props.color}}>&#9823;</span>

  )
}

export default Pawn