import { useState, useEffect, useContext } from "react";
import React from 'react';
import useContract from "../../hooks/contract";

function Demo() {

  //   -----   STATES   -----
  const [playerNumber, setPlayerNumber] = React.useState(null);
  const [playerPosition, setPlayerPosition] = React.useState(1);
  const [gameOn, setGameOn] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(0);
  const { monopolyContract, moneyPolyContract, account } = useContract();
  const [playerHasChoice, setPlayerHasChoice] = useState(false);
  const [houses, setHouses] = useState([]);
  const [allPlayerPositions, setAllPlayerPositions] = useState([]);

  //   -----   FUNCTIONS   -----
  //   Player Number
  const assignPlayerNumber = async () => {
      if(!monopolyContract) return;
      await monopolyContract.methods.assignPlayerNumber().send({ from: account });
    const player = await monopolyContract.methods.players(account).call();
    if (player.playerNumber !== '0') {
      setPlayerNumber(player.playerNumber);
    }
  };

  useEffect(() => {
    const getPlayerNumber = async () => {
      if(!monopolyContract) return;
      const player = await monopolyContract.methods.players(account).call();
      if (player.playerNumber !== '0') {
        setPlayerNumber(player.playerNumber);
      }
    };
    if(monopolyContract) getPlayerNumber();
  }, [account, monopolyContract]);

  //   Player Position
  useEffect(() => {
    const getPlayerPosition = async () => {
      if(!monopolyContract) return;
      const player = await monopolyContract.methods.players(account).call();
        setPlayerPosition(player.playerPosition);
    };
    getPlayerPosition();
  }, [account, monopolyContract]);

  //   Game On
  useEffect(() => {
    const fetchGameOn = async () => {
      if(!monopolyContract) return;
      const gameOnValue = await monopolyContract.methods.getGameOn().call();
      console.log("gameOnValue is on : ", gameOnValue); 
      setGameOn(gameOnValue);
    };
    fetchGameOn();
  }, [account, monopolyContract, playerNumber]);

    //   Player Turn
  useEffect(() => {
    const fetchPlayerTurn = async () => {
      if(!monopolyContract) return;
      const playerTurnValue = await monopolyContract.methods.getPlayerTurn().call();
      console.log("playerTurn is : ", playerTurnValue); 
      setPlayerTurn(playerTurnValue);
    };
    fetchPlayerTurn();
  }, [account, monopolyContract]);

    //   Get Houses
    useEffect(() => {
  //   check Houses
  const getHouses = async () => {
      if(!monopolyContract) return;
      const houses = await monopolyContract.methods.getHouses().call();
        setHouses(houses);
        console.log("houses : ", houses);
      };
      getHouses();
    }, [account, monopolyContract,playerTurn]);

  //   Reset Game
  const resetGame = async () => {
      if(!monopolyContract) return;
      await monopolyContract.methods.resetGame().send({ from: account });
    setPlayerNumber(null);
    setPlayerPosition(0);
    setPlayerTurn(1);
    setPlayerBalance(0);
    setHouses([]);
   
  }


  //   Throw Dice
  const throwDice = async () => {
      if(!monopolyContract) return;
      await monopolyContract.methods.throwDice().send({ from: account });
  };

  //   Build House
  const buildHouse = async () => {
      if(!monopolyContract) return;
      await monopolyContract.methods.buildHouse().send({ from: account });
  };

  //   End Turn
  const endTurn = async () => {
      if(!monopolyContract) return;
      await monopolyContract.methods.endTurn().send({ from: account });
  };

  //   Player Balance
  const getPlayerBalance = async () => {
      if(!monopolyContract) return;
      const balance = await moneyPolyContract.methods.balanceOf(account).call();
    setPlayerBalance(balance);
    console.log("balance is : ", balance); 
    console.log("playerBalance is : ", playerBalance); 
    console.log("player choice ", playerHasChoice);
  };

  useEffect(() => {
    if (!moneyPolyContract) {
      return;
    }
    getPlayerBalance();
  //  refreshHouses(); // test
  }, [account, moneyPolyContract]);

// All player positions
useEffect(() => {
  const getAllPlayerPositions = async () => {
      if(!monopolyContract) return;
      const allPlayerPositionsValue = await monopolyContract.methods.getAllPlayerPositions().call();
    console.log("allPlayerPositionsValue is : ", allPlayerPositionsValue); 
    setAllPlayerPositions(allPlayerPositionsValue);
  };
  getAllPlayerPositions();
  console.log("allPlayerPositions is : ", allPlayerPositions);
}, [account, monopolyContract]);



  
  /*
  const refreshHouses = async () => {
    const allHouses = await contract.methods.getAllHouses().call();
  
    const houses = allHouses.map((house: House) => {
      return [house.position, house.owner, house.number];
    });
  
    // houses est maintenant un tableau à double entrée de 40 entrées, avec chacune la position, le propriétaire et le nombre de maison
    console.log(houses);
    setHouses(houses);
  };
*/
  //   -----   EVENTS   -----


  useEffect(() => {
    if (!monopolyContract) {
      return;
    }
    monopolyContract.events.DiceThrown({}, (error: any, event: any) => {
      if (!error) {
        setPlayerPosition(event.returnValues.playerPosition);
        setPlayerTurn(event.returnValues.playerTurn);
        setPlayerHasChoice(event.returnValues.playerHasChoice);
      } else {
        console.error(error);
      }
    });
  }, [account, monopolyContract]);
  
  
  //   -----   RENDERING   -----
  return (
    <div className="btns">

      
      <div>Player {playerNumber ? playerNumber : ''}</div>
      <div>Position {playerPosition ? playerPosition : ''}</div>
      <button onClick={resetGame}>Reset game</button>

      <div>
      {!gameOn
        ? <div>
        <button onClick={assignPlayerNumber}>Assign player number</button>
          </div>
        : <p>game is ON</p>
      }
    </div>

      <div>
      {playerNumber == playerTurn && gameOn
        ? <div>
        <button onClick={throwDice}>Throw dice</button>
          </div>
        : <p>not your turn</p>
      }
    </div>
      <p>Player Turn {playerTurn}</p>
      <p>Player Balance {playerBalance}</p>
      <p>Player has Choice {playerHasChoice ? "Yes" : "No"}</p>
      <div>
      {playerHasChoice && gameOn && playerNumber == playerTurn
        ? <div>
        <button onClick={buildHouse}>build House</button>
        <button onClick={endTurn}>end Turn</button>
          </div>
        : <p>not able to build here</p>
      }
    </div>
    <p>Houses {houses}</p>
    <div>
      {allPlayerPositions.map((position, i) => (
        <p key={i}>Player {i + 1} is at position {position}</p>
      ))}
    </div>


    </div>
  );

}

export default Demo;