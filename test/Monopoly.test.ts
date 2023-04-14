import {expect, use} from 'chai';
import {Contract, Event, Transaction, Wallet} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import Monopoly from '../build/Monopoly.json';
import MoneyPoly from '../build/MoneyPoly.json';

use(solidity);

type Player = { playerPosition: number; playerNumber: number };
type Property = { isConstructible: boolean; constructionCost: number; rentPrice: number };
type House = { position: number; owner: number };

interface MonopolyContract extends Contract {
	assignPlayerNumber(): Promise<void> | any;

	resetGame(): Promise<void> | any;

	getPlayerAddress(playerNumber: number): Promise<string> | any;

	getGameOn(): Promise<Transaction> | any;

	getPlayerTurn(): Promise<number> | any;

	throwDice(): Promise<void> | any;

	buildHouse(): Promise<void> | any;

	endTurn(): Promise<void> | any;

	getHouses(): Promise<number[][]> | any;

	players(player: string): Promise<Player> | any;

	properties(index: number): Promise<Property> | any;

	houses(index: number): Promise<House> | any;
}

function connectMonopoly(contract: Contract, wallet: Wallet) {
	return contract.connect(wallet) as MonopolyContract;
}

function startGame(monopoly: MonopolyContract, playerWallets: Wallet[]) {
	return Promise.all(playerWallets.map(async (wallet) => {
		let tx = await connectMonopoly(monopoly, wallet).assignPlayerNumber();
		await tx.wait();
	}));
}

describe('Monopoly contract', () => {
	const [playerWallet1, playerWallet2, playerWallet3, playerWallet4] = new MockProvider().getWallets();
	let playerWallets = [playerWallet1, playerWallet2, playerWallet3, playerWallet4];
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
		await startGame(monopoly, playerWallets);
		let gameOn = await monopoly.getGameOn();

		expect(gameOn).to.equal(true);
	});

	it('should revert game status to false after resetGame()', async function () {
		await startGame(monopoly, playerWallets);
		await connectMonopoly(monopoly, playerWallet1).resetGame();

		let gameOn = await monopoly.getGameOn();

		expect(gameOn).to.equal(false);
	});

	it('should allow throwDice() only for registered players, when the game is on and if its player turn', async function () {
		await startGame(monopoly, playerWallets);
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

	it('should prevent a player from throwing dive twice in a row', async function () {
		await startGame(monopoly, playerWallets);
		expect(await monopoly.getGameOn()).to.be.true;

		// Player 1 throws dice
		let tx = await connectMonopoly(monopoly, playerWallet1).throwDice();
		await tx.wait();

		// Player 1 can't throw dice again
		await expect(connectMonopoly(monopoly, playerWallet1).throwDice()).to.be.revertedWith("You have already thrown the dice.");
	});

	it('should update player position after calling throwDice()', async function () {
		await startGame(monopoly, playerWallets);
		expect(await monopoly.getGameOn()).to.be.true;

		// Check initial player positions
		let player1 = await monopoly.players(playerWallet1.address);
		let player2 = await monopoly.players(playerWallet2.address);

		let player1Position = player1.playerPosition;
		let player2Position = player2.playerPosition;

		expect(player1Position).to.equal(1);
		expect(player2Position).to.equal(1);

		// // Player 1 throws dice and updates position
		const tx1 = await monopoly.connect(playerWallet1).throwDice();
		const receipt1 = await tx1.wait();
		const diceThrownEvent1 = receipt1.events.filter((event: Event) => event.event === 'DiceThrown');

		player1Position = diceThrownEvent1[0].args.playerPosition.toNumber();
		player1 = await monopoly.players(playerWallet1.address);

		expect(player1.playerPosition).to.equal(player1Position);
	});

	it('should allow a player to build a house when they have the choice and enough tokens', async function () {
		await startGame(monopoly, playerWallets);
		expect(await monopoly.getGameOn()).to.be.true;

		const tx1 = await monopoly.connect(playerWallet1).throwDice();
		const receipt1 = await tx1.wait();
		const diceThrownEvent1 = receipt1.events.filter((event: Event) => event.event === 'DiceThrown');

		const playerTurn = await monopoly.getPlayerTurn();
		console.log("playerTurn", playerTurn.toNumber())

		let tx = await monopoly.connect(playerWallet1).buildHouse();
		await tx.wait();

		let player1Position = diceThrownEvent1[0].args.playerPosition.toNumber();
		let houses = await connectMonopoly(monopoly, playerWallet1).getHouses();
		let houseOnPositionOwner = houses[player1Position - 1][0].toNumber();

		expect(houseOnPositionOwner).to.equal(1);
	});

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
