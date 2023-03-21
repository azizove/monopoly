import { useState, useEffect, useContext } from "react";
import React from 'react';
import EthContext from "../../contexts/EthContext/EthContext";

function Demo() {

  //   -----   STATES   -----
  const [playerNumber, setPlayerNumber] = React.useState(null);
  const [playerPosition, setPlayerPosition] = React.useState(0);
  const [gameOn, setGameOn] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(0);
  const { state: { accounts, monopolyContract, moneyPolyContract } } = useContext(EthContext);

  //   -----   FUNCTIONS   -----
  //   Player Number
  const assignPlayerNumber = async () => {
    await monopolyContract.methods.assignPlayerNumber().send({ from: accounts[0] });
    const player = await monopolyContract.methods.players(accounts[0]).call();
    if (player.playerNumber !== '0') {
      setPlayerNumber(player.playerNumber);
    }
  };

  useEffect(() => {
    const getPlayerNumber = async () => {
      const player = await monopolyContract.methods.players(accounts[0]).call();
      if (player.playerNumber !== '0') {
        setPlayerNumber(player.playerNumber);
      }
    };
    getPlayerNumber();
  }, [accounts, monopolyContract]);

  //   Player Position
  useEffect(() => {
    const getPlayerPosition = async () => {
      const player = await monopolyContract.methods.players(accounts[0]).call();
        setPlayerPosition(player.playerPosition);
    };
    getPlayerPosition();
  }, [accounts, monopolyContract]);

  //   Game On
  useEffect(() => {
    const fetchGameOn = async () => {
      const gameOnValue = await monopolyContract.methods.getGameOn().call();
      console.log("gameOnValue is on : ", gameOnValue); 
      setGameOn(gameOnValue);
    };
    fetchGameOn();
  }, [accounts, monopolyContract, playerNumber]);

    //   Player Turn
  useEffect(() => {
    const fetchPlayerTurn = async () => {
      const playerTurnValue = await monopolyContract.methods.getPlayerTurn().call();
      console.log("playerTurn is : ", playerTurnValue); 
      setPlayerTurn(playerTurnValue);
    };
    fetchPlayerTurn();
  }, [accounts, monopolyContract]);

  //   Reset Game
  const resetGame = async () => {
    await monopolyContract.methods.resetGame().send({ from: accounts[0] });
    setPlayerNumber(null);
    setPlayerPosition(0);
    setPlayerTurn(1);
    setPlayerBalance(0);
  }


  //   Throw Dice
  const throwDice = async () => {
    await monopolyContract.methods.throwDice().send({ from: accounts[0] });
  };

  //   Player Balance
  const getPlayerBalance = async () => {
    const balance = await moneyPolyContract.methods.balanceOf(accounts[0]).call();
    setPlayerBalance(balance);
    console.log("balance is : ", balance); 
    console.log("playerBalance is : ", playerBalance); 
  };

  useEffect(() => {
    if (!moneyPolyContract) {
      return;
    }
    getPlayerBalance();
  }, [accounts, moneyPolyContract]);

  //   -----   EVENTS   -----


  useEffect(() => {
    if (!monopolyContract) {
      return;
    }
    monopolyContract.events.DiceThrown({}, (error, event) => {
      if (!error) {
        setPlayerPosition(event.returnValues.playerPosition);
        setPlayerTurn(event.returnValues.playerTurn);
      } else {
        console.error(error);
      }
    });
  }, [accounts, monopolyContract]);
  
  
  //   -----   RENDERING   -----
  return (
    <div className="btns">

      <button onClick={assignPlayerNumber}>Assign player number</button>
      <div>Player {playerNumber ? playerNumber : ''}</div>
      <div>Position {playerPosition ? playerPosition : ''}</div>
      <button onClick={resetGame}>Reset game</button>
      <button onClick={throwDice}>Throw dice</button>
      <p>Game is {gameOn ? "ON" : "OFF"}</p>
      <p>Player Turn {playerTurn}</p>
      <p>Player Balance {playerBalance}</p>


    </div>
  );

}

export default Demo;
