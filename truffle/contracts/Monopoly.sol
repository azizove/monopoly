// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Monopoly {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Player {
        uint256 position;
        uint256 playerNumber;
        // Ajouter d'autres informations sur le joueur ici si nécessaire
    }

    uint256 public playerCount = 0;
    mapping(address => Player) public players;
    mapping (address => uint256) public playerPosition;
    bool public gameOn = false;
    address public adminAddress;
    EnumerableSet.AddressSet private playerSet;

    event NewPlayer(address indexed player, uint256 indexed number);
    event DiceThrown(address indexed player, uint256 diceValue, uint256 playerPosition);


    constructor(address _adminAddress) {
        adminAddress = _adminAddress;
    }

    function generateRandomNumber() private view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 6 + 1;
    }

    function assignPlayerNumber() public {
        require(players[msg.sender].playerNumber == 0, "Player already has a number");
        require(playerCount < 4, "Maximum number of players reached");

        players[msg.sender].playerNumber = playerCount + 1;
        playerSet.add(msg.sender);
        emit NewPlayer(msg.sender, playerCount + 1);

        playerCount++;

        if (playerCount == 4) {
            gameOn = true;
        }
    }

    function resetGame() public {
        require(msg.sender == adminAddress, "Only the admin can reset the game");
        playerCount = 0;
        gameOn = false;
        // Réinitialiser le numéro de joueur pour tous les joueurs enregistrés
        for (uint256 i = 1; i <= 4; i++) {
            address playerAddress = getPlayerAddress(i);
            if (playerAddress != address(0)) {
                players[playerAddress].playerNumber = 0;
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

    modifier onlyPlayer {
    require(players[msg.sender].playerNumber != 0, "Only registered players can throw the dice.");
    _;
    }

    modifier gameIsOn {
        require(gameOn == true, "The game is not on.");
        _;
    }


    function throwDice() public onlyPlayer gameIsOn {
        uint256 diceValue = generateRandomNumber();
        playerPosition[msg.sender] += diceValue;
        emit DiceThrown(msg.sender, diceValue, playerPosition[msg.sender]);
    }


}

// OLD

  /*
  uint256 value;

  function read() public view returns (uint256) {
    return value;
  }

  function write(uint256 newValue) public {
    value = newValue;
  }

    function assignPlayerNumber() public {
    value = newValue;
  }
  */
