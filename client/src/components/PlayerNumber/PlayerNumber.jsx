import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import React from 'react';

function Demo() {

  //   -----   STATES   -----
  const { state: { contract, accounts } } = useEth();
  const [playerNumber, setPlayerNumber] = React.useState(null);
  const [playerPosition, setPlayerPosition] = React.useState(0);
  const [gameOn, setGameOn] = useState(false);


  //   -----   FUNCTIONS   -----
  //   Player Number
  const assignPlayerNumber = async () => {
    await contract.methods.assignPlayerNumber().send({ from: accounts[0] });
    const player = await contract.methods.players(accounts[0]).call();
    if (player.playerNumber !== '0') {
      setPlayerNumber(player.playerNumber);
    }
  };

  useEffect(() => {
    const getPlayerNumber = async () => {
      const player = await contract.methods.players(accounts[0]).call();
      if (player.playerNumber !== '0') {
        setPlayerNumber(player.playerNumber);
      }
    };
    getPlayerNumber();
  }, [accounts, contract]);

  //   Player Position
  const getPlayerPosition = async () => {
    if (!playerNumber) return;
    const position = await contract.methods.playerPosition(accounts[0]).call();
    setPlayerPosition(position);
  };

  useEffect(() => {
    getPlayerPosition();
  }, [accounts, contract]);
  

  //   Game On
  useEffect(() => {
    const fetchGameOn = async () => {
      const gameOnValue = await contract.methods.getGameOn().call();
      console.log("gameOnValue is on : ", gameOnValue); 
      setGameOn(gameOnValue);
    };
    fetchGameOn();
  }, [accounts, contract, playerNumber]);

  //   Reset Game
  const resetGame = async () => {
    await contract.methods.resetGame().send({ from: accounts[0] });
    setPlayerNumber(null);
    setPlayerPosition(0);
  }


  //   Throw Dice
  const throwDice = async () => {
    await contract.methods.throwDice().send({ from: accounts[0] });
  };


  //   -----   EVENTS   -----


  useEffect(() => {
    if (!contract) {
      return;
    }
    contract.events.DiceThrown({}, (error, event) => {
      if (!error) {
        // Mettre à jour l'état de React ici avec la nouvelle position du joueur
        setPlayerPosition(event.returnValues.playerPosition);
      } else {
        console.error(error);
      }
    });
  }, [accounts, contract]);
  
  
  //   -----   RENDERING   -----
  return (
    <div className="btns">

      <button onClick={assignPlayerNumber}>Assign player number</button>
      <div>Player {playerNumber ? playerNumber : ''}</div>
      <div>Position {playerPosition ? playerPosition : ''}</div>
      <button onClick={resetGame}>Reset game</button>
      <button onClick={throwDice}>Throw dice</button>
      <p>Game is {gameOn ? "ON" : "OFF"}</p>


    </div>
  );

}

export default Demo;
