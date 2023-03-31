import React from "react";
import { GameSquare } from "./GameSquare";
import { ProfileCard } from "../Profile/ProfileCard";

export const GameBoard = () =>{
  const num_squares = Array.from(Array(40));

  return (
    <React.Fragment>
      <div className="board">

        {num_squares.map((n, id) => {

          return (<GameSquare
            id={id}
            key={id}
          />)
        })}


        <div className="center-square square">
          <div className="center-txt">
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}