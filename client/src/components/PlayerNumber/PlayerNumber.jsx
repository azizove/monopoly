import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import React from 'react';

function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("?");

  // new (ContractBtns)
  const { state: { contract, accounts } } = useEth();
  const [playerNumber, setPlayerNumber] = React.useState(null);

  const assignPlayerNumber = async () => {
    await contract.methods.assignPlayerNumber().send({ from: accounts[0] });
    const player = await contract.methods.players(accounts[0]).call();
    if (player.playerNumber !== '0') {
      setPlayerNumber(player.playerNumber);
    }
  };

  return (
    <div className="btns">

      <button onClick={assignPlayerNumber}>Assign player number</button>
          <div>Player {playerNumber ? playerNumber : ''}</div>

    </div>
  );

}

export default Demo;
