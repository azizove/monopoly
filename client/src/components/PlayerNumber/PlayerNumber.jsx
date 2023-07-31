import { useState, useEffect, useContext } from "react";
import React from 'react';
import EthContext from "../../contexts/EthContext/EthContext";

function Demo() {

  //   -----   STATES   -----
  const [playerNumber, setPlayerNumber] = React.useState(null);
  const [playerPosition, setPlayerPosition] = React.useState(1);
  const [gameOn, setGameOn] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(0);
  const { state: { accounts, monopolyContract, moneyPolyContract } } = useContext(EthContext);
  const [playerHasChoice, setPlayerHasChoice] = useState(false);
  const [houses, setHouses] = useState([]);
  const [allPlayerPositions, setAllPlayerPositions] = useState([]);

  // RAJOUT
  const [diceValue, setDiceValue] = useState(1);

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

    //   Get Houses
    useEffect(() => {
  //   check Houses
  const getHouses = async () => {
        const houses = await monopolyContract.methods.getHouses().call();
        setHouses(houses);
        console.log("houses : ", houses);
      };
      getHouses();
    }, [accounts, monopolyContract,playerTurn]);

  //   Reset Game
  const resetGame = async () => {
    await monopolyContract.methods.resetGame().send({ from: accounts[0] });
    setPlayerNumber(null);
    setPlayerPosition(0);
    setPlayerTurn(1);
    setPlayerBalance(0);
    setHouses([]);
   
  }


  //   Throw Dice
  const throwDice = async () => {
    await monopolyContract.methods.throwDice().send({ from: accounts[0] });
  };

  //   Build House
  const buildHouse = async () => {
    await monopolyContract.methods.buildHouse().send({ from: accounts[0] });
  };

  //   End Turn
  const endTurn = async () => {
    await monopolyContract.methods.endTurn().send({ from: accounts[0] });
  };

  //   Player Balance
  const getPlayerBalance = async () => {
    const balance = await moneyPolyContract.methods.balanceOf(accounts[0]).call();
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
  }, [accounts, moneyPolyContract]);

// All player positions
useEffect(() => {
  const getAllPlayerPositions = async () => {
    const allPlayerPositionsValue = await monopolyContract.methods.getAllPlayerPositions().call();
    console.log("allPlayerPositionsValue is : ", allPlayerPositionsValue); 
    setAllPlayerPositions(allPlayerPositionsValue);
  };
  getAllPlayerPositions();
  console.log("allPlayerPositions is : ", allPlayerPositions);
}, [accounts, monopolyContract]);



  
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
    monopolyContract.events.DiceThrown({}, (error, event) => {
      if (!error) {
        setPlayerPosition(event.returnValues.playerPosition);
        setPlayerTurn(event.returnValues.playerTurn);
        setPlayerHasChoice(event.returnValues.playerHasChoice);

        // A RAJOUTER
        setDiceValue(event.returnValues.diceValue)
        // FIN DU RAJOUT



      } else {
        console.error(error);
      }
    });
  }, [accounts, monopolyContract]);
  
  
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
