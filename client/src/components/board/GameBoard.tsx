import React from "react";
import DiceCubes from "../dice/DiceCubes";
import { GameSquare } from "./GameSquare";

export default function GameBoard() {
  const num_squares: Array<number> = Array.from(Array(40));

  return (
    <React.Fragment>
      <div className="board">

        {num_squares.map((n, index) => {
          const id: number = index;

          return (<GameSquare
            id={id}
            key={id}
          />)
        })}


        <div className="center-square square">
          <DiceCubes/>
        </div>
      </div>
    </React.Fragment>
  );
}
