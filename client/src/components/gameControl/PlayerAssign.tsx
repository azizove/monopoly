import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, CardActions, Grid, Typography } from "@mui/material";

import useContract from "../../hooks/contract";

type Props = {};

const PlayerAssign = (props: Props) => {
  const [playerNumber, setPlayerNumber] = useState(null);
  const [playerPosition, setPlayerPosition] = useState(1);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(0);
  const [allPlayerPositions, setAllPlayerPositions] = useState([]);
  const { monopolyContract, moneyPolyContract, account } = useContract();
  const assignPlayerNumber = async () => {
    if (!monopolyContract) return;
    await monopolyContract.methods.assignPlayerNumber().send({ from: account });
    const player = await monopolyContract.methods.players(account).call();
    if (player.playerNumber !== "0") {
      setPlayerNumber(player.playerNumber);
    }
  };
  const resetGame = async () => {
    if (!monopolyContract) return;
    await monopolyContract.methods.resetGame().send({ from: account });
    setPlayerNumber(null);
    //   setPlayerPosition(0);
    //   setPlayerTurn(1);
    //   setPlayerBalance(0);
    //   setHouses([]);
  };
  const getPlayerNumber = async () => {
    if(!monopolyContract) return;
    const player = await monopolyContract.methods.players(account).call();
    if (player.playerNumber !== '0') {
      setPlayerNumber(player.playerNumber);
    }
  };
  const fetchPlayerTurn = async () => {
    if(!monopolyContract) return;
    const playerTurnValue = await monopolyContract.methods.getPlayerTurn().call();
    console.log("playerTurn is : ", playerTurnValue); 
    setPlayerTurn(playerTurnValue);
  };


  useEffect(() => {
    if(monopolyContract) getPlayerNumber();
  }, [account, monopolyContract]);
  
  return (
    
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="body2">Player {playerNumber ? playerNumber : ""}</Typography>
            <Typography variant="body2">Position {playerPosition ? playerPosition : ''}</Typography>
            <Typography variant="body2">Player Turn {playerTurn}</Typography>
            <Typography variant="body2">Player Balance {playerBalance}</Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={resetGame}>Reset game</Button>
            <Button variant="contained" onClick={assignPlayerNumber}>Assign player number</Button>
          </CardActions>
        </Card>
  );
};

export default PlayerAssign;
