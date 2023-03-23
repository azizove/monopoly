import React from "react";
import { GameSquare } from "./GameSquare";
import { PropertyCard } from "../Cards/PropertyCard";

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
            <div>dice part</div>
            <div>banker part</div>
            <div><PropertyCard /></div>
            <div>players cards</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}