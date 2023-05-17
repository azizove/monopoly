import { useState, useEffect } from "react";
import { Contract } from "web3-eth-contract";
import json from "../contracts/MoneyPoly.json";
import moneyPolyJson from "../contracts/MoneyPoly.json";
import monopolyJson from "../contracts/Monopoly.json";
import getWeb3 from "../utils/getWeb3";
import useWeb3 from "./web3";

const Hooks = (): any => {
  const [monopolyContract, setMonopolyContract] = useState<Contract|null>();
  const [moneyPolyContract, setMoneyPolyContract] = useState<Contract|null>();
  const [account, setAccount] = useState<any>();

  // const { isLoading, isWeb3, web3 } = useWeb3();

  const getInstance = (abi: any, web3: any) => {
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
      const web3 = await getWeb3();

      if (web3 !== null) {
        const accounts = await web3.eth.getAccounts();
        console.log({ accounts });
        setAccount(accounts[0]);
        setMonopolyContract(getInstance(monopolyAbi, web3));
        setMoneyPolyContract(getInstance(moneyPolyAbi, web3));
      }
    })();
  }, []);

  return { monopolyContract, moneyPolyContract, account };
};
export default Hooks;
