import { Button, Card, CardActions, CardContent } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactDice, { ReactDiceRef } from "react-dice-complete";

import useContract from "../../hooks/contract";

type Props = {};

const PlayerDice = (props: Props) => {
  const reactDice = useRef<ReactDiceRef>(null);
  const { monopolyContract, moneyPolyContract, account } = useContract();
	const [diceValues, setDiceValues] = useState([4, 4]);

  const throwDice = async () => {
    if (!monopolyContract) return;
    try {
      await monopolyContract.methods.throwDice().send({ from: account });
    } catch (error) {
      console.log(error);
    }
  };

  const rollDone = (totalValue: number, values: number[]) => {
    console.log(reactDice.current);
  };

	const diceThrowCallback =  () => {
		setInterval(() => {
			const totalValue = getRandomInt(2, 12)
			const diceValues = getDiceValues(totalValue);
			reactDice.current?.rollAll(diceValues)
		}, 5000)
	}

	const getDiceValues = (totalValue: number): number[] => {
		let firstValue = getRandomInt(1, 6);
		let secondValue = totalValue - firstValue;
		while (secondValue < 1 || secondValue > 6) {
			firstValue = getRandomInt(1, 6);
			secondValue = totalValue - firstValue;
		}
		return [firstValue, secondValue];
	}

	const getRandomInt = (min: number, max: number) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
	}
	

	useEffect(() => {
    if (!monopolyContract) {
      return;
    }
		diceThrowCallback();
    // monopolyContract.events.DiceThrown({}, (error: any, event: any) => {
    //   if (!error) {
    //     // setPlayerPosition(event.returnValues.playerPosition);
    //     // setPlayerTurn(event.returnValues.playerTurn);
    //     // setPlayerHasChoice(event.returnValues.playerHasChoice);
		// 		reactDice.current?.rollAll(event.returnValues.playerHasChoice)
    //   } else {
    //     console.error(error);
    //   }
    // });
		
  }, [account, monopolyContract]);
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <ReactDice
          numDice={2}
          ref={reactDice}
          rollDone={rollDone}
          disableIndividual
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={throwDice}>
          Throw Dice
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlayerDice;
