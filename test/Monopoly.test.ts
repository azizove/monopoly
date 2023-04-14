import {expect, use} from 'chai';
import {Contract, Wallet} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import Monopoly from '../build/Monopoly.json';
import MoneyPoly from '../build/MoneyPoly.json';

use(solidity);
type Player = { playerPosition: number; playerNumber: number };
type Property = { isConstructible: boolean; constructionCost: number; rentPrice: number };
type House = { position: number; owner: number };

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

	players(player: string): Promise<Player>;

	properties(index: number): Promise<Property>;

	houses(index: number): Promise<House>;
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

	it('should change game status to true when 4 players are assigned', async function () {
		await connectMonopoly(monopoly, playerWallet1).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet2).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet3).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet4).assignPlayerNumber();

		let gameOn = await monopoly.getGameOn();

		expect(gameOn).to.equal(true);
	});

	it('should revert game status to false after resetGame()', async function () {
		await connectMonopoly(monopoly, playerWallet1).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet2).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet3).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet4).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet1).resetGame();

		let gameOn = await monopoly.getGameOn();

		expect(gameOn).to.equal(false);
	});

	it('should allow throwDice() only for registered players, when the game is on and if its player turn', async function () {
		await connectMonopoly(monopoly, playerWallet1).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet2).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet3).assignPlayerNumber();
		await connectMonopoly(monopoly, playerWallet4).assignPlayerNumber();

		// Ensure the game is on
		expect(await monopoly.getGameOn()).to.be.true;

		// Player 1 can throw dice
		let currentTurn = await monopoly.getPlayerTurn();
		expect(currentTurn).to.equal(1);
		await expect(connectMonopoly(monopoly, playerWallet1).throwDice()).to.not.be.reverted;
		await connectMonopoly(monopoly, playerWallet1).endTurn();

		// Player 2 can throw dice
		currentTurn = await monopoly.getPlayerTurn();
		expect(currentTurn).to.equal(2);
		await expect(connectMonopoly(monopoly, playerWallet2).throwDice()).to.not.be.reverted;

		// Player 1 can't throw dice again
		await expect(connectMonopoly(monopoly, playerWallet1).throwDice()).to.be.revertedWith("Not your turn.");

		await connectMonopoly(monopoly, playerWallet2).endTurn();
	});

	// it('should update player position after calling throwDice()', async function () {
	// 	// Add test logic
	// });

	// it('should allow a player to build a house when they have the choice and enough tokens', async function () {
	// 	// Add test logic
	// });

	// it('should burn player tokens after building a house', async function () {
	// 	// Add test logic
	// });

	// it('should allow a player to end their turn when they have the choice', async function () {
	// 	// Add test logic
	// });

	// it('should represent houses correctly on the board', async function () {
	// 	// Add test logic
	// });
});
