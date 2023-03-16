import React from "react";
import { GameSquare } from "./GameSquare";

export const GameBoard = () =>{
  const num_squares = Array.from(Array(40));

  return (
    <React.Fragment>
      <div className="board">

        {num_squares.map((n, index) => {
          const id = index + 1;

          return (<GameSquare
            id={id}
            key={id}
          />)
        })}


        <div className="center-square square">
          <div className="center-txt">
            <a href="https://www.coderdreams.com/">Visit CoderDreams to learn more</a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}