import {expect, use} from 'chai';
import {Contract} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import Monopoly from '../build/Monopoly.json';
import MoneyPoly from '../build/MoneyPoly.json';

use(solidity);

describe('Monopoly contract', () => {
	const [player1, player2, player3, player4] = new MockProvider().getWallets();
	let monopoly: Contract;
	let moneyPoly: Contract;

	beforeEach(async () => {
		moneyPoly = await deployContract(player1, MoneyPoly);
		let moneyPolyAddress = moneyPoly.address;
		monopoly = await deployContract(player1, Monopoly, [player1.address, moneyPolyAddress]);
	});

	it('should assign unique player numbers', async function () {
		await monopoly.connect(player1).assignPlayerNumber();
		await monopoly.connect(player2).assignPlayerNumber();

		let player1Number = await monopoly.players(player1.address);
		let player2Number = await monopoly.players(player2.address);

		expect(player1Number).to.not.equal(0);
		expect(player2Number).to.not.equal(0);
		expect(player1Number).to.not.equal(player2Number);
	});

	// it('should change game status to true when 4 players are assigned', async function () {
	// 	// Add test logic
	// });

	// it('should revert game status to false after resetGame()', async function () {
	// 	// Add test logic
	// });
	//
	// it('should allow throwDice() only for registered players and when the game is on', async function () {
	// 	// Add test logic
	// });
	//
	// it('should update player position after calling throwDice()', async function () {
	// 	// Add test logic
	// });
	//
	// it('should allow a player to build a house when they have the choice and enough tokens', async function () {
	// 	// Add test logic
	// });
	//
	// it('should burn player tokens after building a house', async function () {
	// 	// Add test logic
	// });
	//
	// it('should allow a player to end their turn when they have the choice', async function () {
	// 	// Add test logic
	// });
	//
	// it('should represent houses correctly on the board', async function () {
	// 	// Add test logic
	// });
});
