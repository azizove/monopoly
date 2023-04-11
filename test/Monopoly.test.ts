import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import Monopoly from '../build/Monopoly.json';
import MoneyPoly from '../build/MoneyPoly.json';

use(solidity);

describe('Monopoly contract', () => {
  const [wallet, walletTo] = new MockProvider().getWallets();
  let monopoy: Contract;
  let moneyPoly: Contract;

  beforeEach(async () => {
    moneyPoly = await deployContract(wallet, MoneyPoly);
    let moneyPolyAddress = moneyPoly.address;
    monopoy = await deployContract(wallet, Monopoly, [wallet.address, moneyPolyAddress]);
  });

  it('should be ok', function () {
    expect(true).to.be.true;
  });

  // it('initial value', async () => {
  //   const text = await storage.get();
  //   expect('get').to.be.calledOnContract(storage);
  //   expect(text).to.equal('');
  // });
  //
  // it('Set value', async() => {
  //   await storage.set('hello world');
  //   const text = await storage.get();
  //   expect(text).to.equal('hello world');
  // });
});
