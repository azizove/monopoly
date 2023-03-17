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
            <div>dice part</div>
            <div>banker part</div>
            <div>my cards</div>
            <div>players cards</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}