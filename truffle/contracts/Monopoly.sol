// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./MoneyPoly.sol";

contract Monopoly {
    using EnumerableSet for EnumerableSet.AddressSet;

    MoneyPoly public moneyPolyContract;
    struct Player {
        uint256 playerPosition;
        uint256 playerNumber;
    }

    uint256 public playerCount = 0;
    mapping(address => Player) public players;
    bool public gameOn = false;
    address public adminAddress;
    EnumerableSet.AddressSet private playerSet;
    uint256 public playerTurn = 1;

    event NewPlayer(address indexed player, uint256 indexed number);
    event DiceThrown(address indexed player, uint256 diceValue, uint256 playerPosition, uint256 playerTurn);

    constructor(address _adminAddress, address _moneyPolyAddress) {
    adminAddress = _adminAddress;

    // Initialiser le contrat MoneyPoly en utilisant son adresse
    moneyPolyContract = MoneyPoly(_moneyPolyAddress);
}
    function generateRandomNumber() private view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 6 + 1;
    }

    function assignPlayerNumber() public {
        require(players[msg.sender].playerNumber == 0, "Player already has a number");
        require(playerCount < 4, "Maximum number of players reached");

        players[msg.sender].playerNumber = playerCount + 1;
        playerSet.add(msg.sender);
        moneyPolyContract.mintTokens(msg.sender); //new3
        emit NewPlayer(msg.sender, playerCount + 1);

        playerCount++;

        if (playerCount == 4) {
            gameOn = true;
        }
    }

    function resetGame() public {
        require(msg.sender == adminAddress, "Only the admin can reset the game");
        // Burn tous les tokens de tous les joueurs en appelant la fonction burnAll de MoneyPoly
        for (uint i = 0; i < playerSet.length(); i++) {
            address playerAddress = playerSet.at(i);
            if (players[playerAddress].playerNumber != 0) {
                uint256 balance = moneyPolyContract.balanceOf(playerAddress);
                moneyPolyContract.burnAll(playerAddress);
            }
        }
        playerCount = 0;
        gameOn = false;
        playerTurn = 0;
        // Réinitialiser le numéro de joueur pour tous les joueurs enregistrés
        for (uint256 i = 1; i <= 4; i++) {
            address playerAddress = getPlayerAddress(i);
            if (playerAddress != address(0)) {
                players[playerAddress].playerNumber = 0;
                players[playerAddress].playerPosition = 0;
                playerSet.remove(playerAddress);
            }
        }
    }
    function getPlayerAddress(uint256 playerNumber) internal view returns (address) {
        // Récupérer l'adresse du joueur correspondant au numéro de joueur donné
        for (uint i = 0; i < playerSet.length(); i++) {
            address playerAddress = playerSet.at(i);
            if (players[playerAddress].playerNumber == playerNumber) {
                return playerAddress;
            }
        }
        return address(0);
    }

    function getGameOn() public view returns (bool) {
        return gameOn;
    }

    function getPlayerTurn() public view returns (uint) {
        return playerTurn;
    }

    modifier onlyPlayer {
    require(players[msg.sender].playerNumber != 0, "Only registered players can throw the dice.");
    _;
    }

    modifier gameIsOn {
        require(gameOn == true, "The game is not on.");
        _;
    }

    modifier ItIsPlayerTurn {
        require(players[msg.sender].playerNumber == playerTurn, "Not your turn.");
        _;
    }


    function throwDice() public onlyPlayer gameIsOn ItIsPlayerTurn {
        playerTurn = (playerTurn) % 4 + 1;
        uint256 diceValue = generateRandomNumber();
        players[msg.sender].playerPosition += diceValue;
        emit DiceThrown(msg.sender, diceValue, players[msg.sender].playerPosition, playerTurn);
    }


}
