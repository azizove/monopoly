import { useState, useEffect } from "react";
import { Contract } from "web3-eth-contract";
import json from "../contracts/MoneyPoly.json";
import moneyPolyJson from "../contracts/MoneyPoly.json";
import monopolyJson from "../contracts/Monopoly.json";
import useWeb3 from "./web3";

const Hooks = (): any => {
  const [monopolyContract, setMonopolyContract] = useState<Contract|null>();
  const [moneyPolyContract, setMoneyPolyContract] = useState<Contract|null>();
  const { isLoading, isWeb3, web3 } = useWeb3();

  const getInstance = (abi: any) => {
    if (!web3) return null;
    const deployedNetwork = json.networks[5777];
    const instance = new web3.eth.Contract(
      abi,
      deployedNetwork && deployedNetwork.address
    );
    return instance;
  }

  const monopolyAbi: any = monopolyJson.abi;
  const moneyPolyAbi: any = moneyPolyJson.abi;
  useEffect(() => {
    (async () => {
      if (web3 !== null) {
        setMonopolyContract(getInstance(monopolyAbi));
        setMoneyPolyContract(getInstance(moneyPolyAbi));
      }
    })();
  }, [isWeb3, web3]);

  return { monopolyContract, moneyPolyContract, isLoading };
};
export default Hooks;
