import {expect, use} from 'chai';
import {Contract, Wallet} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import Monopoly from '../build/Monopoly.json';
import MoneyPoly from '../build/MoneyPoly.json';

use(solidity);

interface MonopolyContract extends Contract {
	assignPlayerNumber(): Promise<void>;

	resetGame(): Promise<void>;

	getPlayerAddress(playerNumber: number): Promise<string>;

	getGameOn(): Promise<boolean>;

	getPlayerTurn(): Promise<number>;

	throwDice(): Promise<void>;

	buildHouse(): Promise<void>;

	endTurn(): Promise<void>;

	getHouses(): Promise<number[][]>;

	players(player: string): Promise<{ playerPosition: number; playerNumber: number }>;

	properties(index: number): Promise<{ isConstructible: boolean; constructionCost: number; rentPrice: number }>;

	houses(index: number): Promise<{ position: number; owner: number }>;
}

function connectMonopoly(contract: Contract, wallet: Wallet) {
	return contract.connect(wallet) as MonopolyContract;
}

describe('Monopoly contract', () => {
	const [playerWallet1, playerWallet2, playerWallet3, playerWallet4] = new MockProvider().getWallets();
	let monopoly: MonopolyContract;
	let moneyPoly: Contract;

	beforeEach(async () => {
		moneyPoly = await deployContract(playerWallet1, MoneyPoly);
		let moneyPolyAddress = moneyPoly.address;
		monopoly = await deployContract(playerWallet1, Monopoly, [playerWallet1.address, moneyPolyAddress]) as MonopolyContract;
	});

	it('should assign unique player numbers', async function () {
		await connectMonopoly(monopoly, playerWallet1).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet2).assignPlayerNumber();

		let player1 = await monopoly.players(playerWallet1.address);
		let player2 = await monopoly.players(playerWallet2.address);

		expect(player1.playerNumber).to.equal(1);
		expect(player2.playerNumber).to.equal(2);
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
