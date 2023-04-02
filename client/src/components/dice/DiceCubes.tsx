import React, { useEffect, useRef, useState } from 'react'
import ReactDice, { ReactDiceRef } from 'react-dice-complete'
import json from '../../contracts/Monopoly.json';
import useWeb3 from '../../hooks/web3';
import { Contract } from 'web3-eth-contract';


export default function DiceCubes() {
  const reactDice = useRef<ReactDiceRef>(null)
  // const { isLoading, isWeb3, web3, accounts } = useWeb3();
  // const [instance, setInstance] = useState<Contract>();
  // const [value, setValue] = useState('');

  // const abi: any = json.abi;

  // useEffect(() => {
  //   (async() => {
  //     if(web3 !== null) {
  //       // const networkId = await web3.eth.net.getId();
  //       const deployedNetwork = json.networks;
  //       const instance = new web3.eth.Contract(
  //         abi,
  //         deployedNetwork && deployedNetwork.address
  //       );
  //       setInstance(instance);
  //     }
  //   })();
  // }, [isLoading, isWeb3]);
  let rollDone = (totalValue: number, values: number[]) => {
    console.log(reactDice.current)
  }

  const rollAll = () => {
    // TODO: Get dice results from smart contract
    const dataFromSmartContract = [5, 2]

    reactDice.current?.rollAll(dataFromSmartContract)
  }

    return (
        <div>
        <ReactDice
            numDice={2}
            ref={reactDice}
            rollDone={rollDone}
            disableIndividual
        />
        <button onClick={rollAll}>Roll All</button>
        </div>
    )

}