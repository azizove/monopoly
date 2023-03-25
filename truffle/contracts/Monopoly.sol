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

    struct Property {
    bool isConstructible;
    uint256 constructionCost;
    uint256 rentPrice;
    }

    struct House {
        uint256 owner; // playerNumber
        uint256 amountOfHouses; // NEW
    }

    uint256 public playerCount = 0;
    mapping(address => Player) public players;
    bool public gameOn = false;
    address public adminAddress;
    uint256 public playerTurn = 1;
    Property[] public properties;
    bool public playerHasChoice;
    House[] public houses;
    address[] private playerAddresses; // tableau des addresses des joueurs. Sert a itérer pour le nettoyage

    // Déclarer les variables de type Property pour éviter la répétition
    Property NOT_AVAILABLE = Property(false, 0, 0);
    Property AVAILABLE_1000 = Property(true, 1000, 100);
    Property AVAILABLE_2000 = Property(true, 2000, 200);
    Property AVAILABLE_3000 = Property(true, 3000, 300);
    Property AVAILABLE_4000 = Property(true, 4000, 400);
    Property AVAILABLE_5000 = Property(true, 5000, 500);
    Property AVAILABLE_6000 = Property(true, 6000, 600);
    Property AVAILABLE_7000 = Property(true, 7000, 700);
    Property AVAILABLE_8000 = Property(true, 8000, 800);

    event NewPlayer(address indexed player, uint256 indexed number);
    event DiceThrown(address indexed player, uint256 diceValue, uint256 playerPosition, uint256 playerTurn, bool playerHasChoice);

    constructor(address _adminAddress, address _moneyPolyAddress) {
    adminAddress = _adminAddress;
    // Initialiser le contrat MoneyPoly en utilisant son adresse
    moneyPolyContract = MoneyPoly(_moneyPolyAddress);

        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_1000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_1000);
        properties.push(AVAILABLE_1000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_2000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_2000);
        properties.push(AVAILABLE_2000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_3000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_3000);
        properties.push(AVAILABLE_3000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_4000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_4000);
        properties.push(AVAILABLE_4000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_5000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_5000);
        properties.push(AVAILABLE_5000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_6000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_6000);
        properties.push(AVAILABLE_6000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_7000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_7000);
        properties.push(AVAILABLE_7000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_8000);
        properties.push(AVAILABLE_8000);
        properties.push(NOT_AVAILABLE);
        properties.push(AVAILABLE_8000);

        playerAddresses = new address[](4); // initialiser le tableau playerAddresses avec une taille de 4

            // TEST5
               for (uint256 i = 0; i < 40; i++) {
            House memory newHouse = House(0, 0);
            houses.push(newHouse);
            }           
}
    function generateRandomNumber() private view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 6 + 1;
    }

    function assignPlayerNumber() public {
        require(players[msg.sender].playerNumber == 0, "Player already has a number");
        require(playerCount < 4, "Maximum number of players reached");
        players[msg.sender].playerNumber = playerCount + 1;
        players[msg.sender].playerPosition = 1;
         playerAddresses[playerCount] = msg.sender; // Ajout de l'adresse du joueur au tableau
        moneyPolyContract.mintTokens(msg.sender);
        emit NewPlayer(msg.sender, playerCount + 1);

        playerCount++;

        if (playerCount == 4) {
            gameOn = true;
        }
    }

    function resetGame() public {

        require(msg.sender == adminAddress, "Only the admin can reset the game");
            // Burn tous les tokens de tous les joueurs en appelant la fonction burnAll de MoneyPoly
        for (uint i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            if (players[playerAddress].playerNumber != 0) {
                moneyPolyContract.burnAll(playerAddress);
            }
        }
        playerCount = 0;
        gameOn = false;
        playerTurn = 1;
        delete houses;
        for (uint256 i = 0; i < 40; i++) {
            House memory newHouse = House(0, 0);
            houses.push(newHouse);
            }

        // Réinitialiser le numéro de joueur et la position pour tous les joueurs enregistrés, on doit boucler, car cest un mapping
        for (uint256 i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            players[playerAddress].playerNumber = 0;
            players[playerAddress].playerPosition = 0;
        }
        playerAddresses = new address[](4);
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
        uint256 diceValue = generateRandomNumber();
        movePlayer(diceValue);
        setPlayerHasChoice();
        emit DiceThrown(msg.sender, diceValue, players[msg.sender].playerPosition, playerTurn, playerHasChoice);
    }

    function movePlayer(uint256 diceValue) private {
        uint256 newPosition = players[msg.sender].playerPosition + diceValue;
        players[msg.sender].playerPosition = newPosition;
        if(newPosition > 40) {newPosition = newPosition % 40;}
    }

    function checkOwner() private view returns (bool) {
    uint256 position = players[msg.sender].playerPosition;
    bool otherOwner = false;
    if (houses[position-1].owner != players[msg.sender].playerNumber && houses[position-1].owner != 0) {
        otherOwner = true;
    }
    return otherOwner;
}

    function setPlayerHasChoice() private {
        if (properties[players[msg.sender].playerPosition-1].isConstructible && moneyPolyContract.balanceOf(msg.sender) >= properties[players[msg.sender].playerPosition-1].constructionCost && !checkOwner()) {
            playerHasChoice = true;            // on ne passe pas au tour suivant, car le joueur appelera buildHouse ou endTurn
        } else {
            playerHasChoice = false;
            playerTurn = (playerTurn) % 4 + 1; // si pas le choix, on passe au joueur suivant
        }
    }


    function buildHouse() public onlyPlayer gameIsOn ItIsPlayerTurn {
        require(playerHasChoice == true, "Player must have choice");
        uint256 constructionCost = properties[players[msg.sender].playerPosition-1].constructionCost;
        require(moneyPolyContract.balanceOf(msg.sender) >= constructionCost, "Not enough tokens");
        houses[players[msg.sender].playerPosition-1].owner = players[msg.sender].playerNumber; // assigne le proprio
        houses[players[msg.sender].playerPosition-1].amountOfHouses += 1; // incremente amountOfHouses
        // Brûler les jetons nécessaires pour la construction de la maison
        moneyPolyContract.burn(msg.sender, constructionCost);
        playerTurn = (playerTurn) % 4 + 1;
    }


    function endTurn() public onlyPlayer gameIsOn ItIsPlayerTurn {
        require(playerHasChoice == true, "Player must have choice");
        playerTurn = (playerTurn) % 4 + 1;
    }


    function getHouses() public view returns (House[] memory) {
        return houses;
    }

}
