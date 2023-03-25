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
        uint256 position;
        uint256 owner; // playerNumber
    }

    uint256 public playerCount = 0;
    mapping(address => Player) public players;
    bool public gameOn = false;
    address public adminAddress;
   // OLD EnumerableSet.AddressSet private playerSet;
    uint256 public playerTurn = 1;
    Property[] public properties;
    bool public playerHasChoice;
    House[] public houses;
    address[] private playerAddresses; // tableau des addresses des joueurs. Sert a itérer pour le nettoyage



    event NewPlayer(address indexed player, uint256 indexed number);
    event DiceThrown(address indexed player, uint256 diceValue, uint256 playerPosition, uint256 playerTurn, bool playerHasChoice);

    constructor(address _adminAddress, address _moneyPolyAddress) {
    adminAddress = _adminAddress;
    // Initialiser le contrat MoneyPoly en utilisant son adresse
    moneyPolyContract = MoneyPoly(_moneyPolyAddress);

        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 1000, 100));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 1000, 100));
        properties.push(Property(true, 1000, 100));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 2000, 200));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 2000, 200));
        properties.push(Property(true, 2000, 200));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 3000, 300));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 3000, 300));
        properties.push(Property(true, 3000, 300));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 4000, 400));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 4000, 400));
        properties.push(Property(true, 4000, 400));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 5000, 500));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 5000, 500));
        properties.push(Property(true, 5000, 500));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 6000, 600));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 6000, 600));
        properties.push(Property(true, 6000, 600));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 7000, 700));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 7000, 700));
        properties.push(Property(true, 7000, 700));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 8000, 800));
        properties.push(Property(true, 8000, 800));
        properties.push(Property(false, 0, 0));
        properties.push(Property(true, 8000, 800));

        playerAddresses = new address[](4); // initialiser le tableau playerAddresses avec une taille de 4


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

        // NEW
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
        // Réinitialiser le numéro de joueur et la position pour tous les joueurs enregistrés
        for (uint256 i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            players[playerAddress].playerNumber = 0;
            players[playerAddress].playerPosition = 0;
        }
        playerAddresses = new address[](0);
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

    //new4
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
        for (uint i = 0; i < houses.length; i++) {
            if (houses[i].position == position && houses[i].owner != players[msg.sender].playerNumber) {
                otherOwner = true;
                break;
            }
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
    
    /*
    // Vérifier si le joueur a déjà des maisons construites
    uint256 numberOfHouses = 1;
    for (uint256 i = 0; i < houses.length; i++) {
        if (houses[i].owner == players[msg.sender].playerNumber) {
            numberOfHouses++;
        }
    }
    numberOfHouses++; // pour la maison construite
    */
    House memory newHouse = House(players[msg.sender].playerPosition, players[msg.sender].playerNumber);
    houses.push(newHouse);
    
    // Brûler les jetons nécessaires pour la construction de la maison
    moneyPolyContract.burn(msg.sender, constructionCost);
    playerTurn = (playerTurn) % 4 + 1;
}

function endTurn() public onlyPlayer gameIsOn ItIsPlayerTurn {
    require(playerHasChoice == true, "Player must have choice");
    playerTurn = (playerTurn) % 4 + 1;
}

function getHouses() public view returns (uint256[][] memory) {
    uint256[][] memory housesData = new uint256[][](40);
    for (uint256 i = 0; i < housesData.length; i++) {
        housesData[i] = new uint256[](2);
    }
    for (uint256 i = 0; i < houses.length; i++) {
        uint256 position = houses[i].position - 1; // convertir en index 0-based
        housesData[position][0] = houses[i].owner;
        housesData[position][1] = housesData[position][1] + 1;
    }
    return housesData;
}




}
