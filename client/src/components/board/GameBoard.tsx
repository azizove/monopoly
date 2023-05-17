import React from "react";
// import PlayerNumber from "../playerNumber/PlayerNumber";
import { GameSquare } from "./GameSquare";
import PlayerAssign from "../gameControl/PlayerAssign";
import { Grid } from "@mui/material";
import PlayerDice from "../gameControl/PlayerDice";
import CaseCard from "../card/CaseCard";

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
        <Grid container spacing={2} sx={{ m: 2 }}>
          <Grid item xs={4}>
            <PlayerAssign />
          </Grid>
          <Grid item xs={4}>
            <PlayerDice />
          </Grid>
          <Grid item xs={4}>
            <CaseCard />
          </Grid>
        </Grid>
        </div>
      </div>
    </React.Fragment>
  );
}
