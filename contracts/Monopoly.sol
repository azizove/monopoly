// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "hardhat/Console.sol";
import "./MoneyPoly.sol";

contract Monopoly {
    using EnumerableSet for EnumerableSet.AddressSet;

    MoneyPoly private moneyPolyContract;

    struct Player {
        uint8 playerPosition;
        uint8 playerNumber;
    }

    struct Property {
    bool isConstructible;
    uint256 constructionCost;
    uint256 rentPrice;
    }

    struct House {
        uint8 owner; // playerNumber
        uint8 amountOfHouses;
    }

    uint8 public playerCount = 0;
    mapping(address => Player) public players;
    bool public gameOn = false;
    address public adminAddress;
    uint8 public playerTurn = 1;
    Property[] public properties;
    bool public playerHasChoice;
    House[] public houses;
    address[] private playerAddresses; // tableau des addresses des joueurs. Sert a itérer pour le nettoyage
    bool public playerThrown = false; // sert a se proteger d un lancer multiple

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

    event NewPlayer(address indexed player, uint8 indexed number);
    event DiceThrown(address indexed player, uint8 diceValue, uint8 playerPosition, uint8 playerTurn, bool playerHasChoice);

    constructor(MoneyPoly _moneyPoly) {
    // Initialiser le contrat MoneyPoly
    moneyPolyContract = _moneyPoly;

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
               for (uint8 i = 0; i < 40; i++) {
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
        for (uint8 i = 0; i < playerAddresses.length; i++) {
            address playerAddress = playerAddresses[i];
            if (players[playerAddress].playerNumber != 0) {
                moneyPolyContract.burnAll(playerAddress);
            }
        }
        playerCount = 0;
        gameOn = false;
        playerTurn = 1;
        delete houses;
        for (uint8 i = 0; i < 40; i++) {
            House memory newHouse = House(0, 0);
            houses.push(newHouse);
            }

        // Réinitialiser le numéro de joueur et la position pour tous les joueurs enregistrés, on doit boucler, car cest un mapping
        for (uint8 i = 0; i < playerAddresses.length; i++) {
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

        modifier firstThrown {
        require(!playerThrown, "You have already thrown this turn.");
        _;
    }

    function throwDice() public onlyPlayer gameIsOn ItIsPlayerTurn firstThrown {
        playerThrown = true;
        uint256 bigDiceValue = generateRandomNumber();
        uint8 diceValue = uint8(bigDiceValue);
        movePlayer(diceValue);
        setPlayerHasChoice();
        emit DiceThrown(msg.sender, diceValue, players[msg.sender].playerPosition, playerTurn, playerHasChoice);
    }

    function movePlayer(uint8 diceValue) private {
        uint8 newPosition = players[msg.sender].playerPosition + diceValue;
        players[msg.sender].playerPosition = newPosition;
        if(newPosition > 40) {newPosition = newPosition % 40;}
    }

    function hasOtherOwner() private view returns (bool) {
        uint8 position = players[msg.sender].playerPosition;
        bool otherOwner = false;
        if (houses[position-1].owner != players[msg.sender].playerNumber && houses[position-1].owner != 0) {
            otherOwner = true;
        }
        return otherOwner;
    }

    function setPlayerHasChoice() private {
        if (properties[players[msg.sender].playerPosition-1].isConstructible && !hasOtherOwner()
            && moneyPolyContract.balanceOf(msg.sender) >= properties[players[msg.sender].playerPosition-1].constructionCost) {
            
            // on ne passe pas au tour suivant, car le joueur appelera buildHouse ou endTurn
            playerHasChoice = true;  

        } else if (properties[players[msg.sender].playerPosition-1].isConstructible && hasOtherOwner()
            && moneyPolyContract.balanceOf(msg.sender) >= properties[players[msg.sender].playerPosition-1].rentPrice) {
            
            playerHasChoice = false;
            payOwnerRent(properties[players[msg.sender].playerPosition-1].rentPrice * houses[players[msg.sender].playerPosition-1].amountOfHouses, msg.sender, positionOwnerSWallet());
            
            // si pas le choix, on passe au joueur suivant
            playerTurn = (playerTurn) % 4 + 1; 
            playerThrown = false;
        }
    }

    modifier buildRequirment() {
        require(playerHasChoice == true, "Player must have choice");
        require(moneyPolyContract.balanceOf(msg.sender) >= properties[players[msg.sender].playerPosition-1].constructionCost, "Not enough tokens");
        _;
    }

    function buildHouse() public onlyPlayer gameIsOn ItIsPlayerTurn buildRequirment() {
        houses[players[msg.sender].playerPosition-1].owner = players[msg.sender].playerNumber; // assigne le proprio
        houses[players[msg.sender].playerPosition-1].amountOfHouses += 1; // incremente amountOfHouses
        // Brûler les jetons nécessaires pour la construction de la maison
        uint256 constructionCost = properties[players[msg.sender].playerPosition-1].constructionCost;
        moneyPolyContract.burn(msg.sender, constructionCost);
        playerTurn = (playerTurn) % 4 + 1;
        playerThrown = false;
    }

    modifier fundsEnoughToRent(uint cost, address tenant, address propertyOwner) {
        if(moneyPolyContract.balanceOf(msg.sender) >= cost) {
            console.log("Not enough tokens");
            
            console.log("Pay all balance to tenant");
            moneyPolyContract.transferFrom(tenant, propertyOwner, cost);
            
            console.log("Remove player from game");
            //removePlayerFromGame(tenant);
        } else {
            _;
        }
    }

    function payOwnerRent(uint amount, address tenant, address propertyOwner) private fundsEnoughToRent(amount, tenant, propertyOwner) {
        address payable tenantAddress = payable(tenant);
        transferTokens(tenantAddress, propertyOwner, amount);
    }

    function positionOwnerSWallet() private view returns (address) {
        uint8 position = players[msg.sender].playerPosition;
        uint8 ownerId = houses[position-1].owner;
        return playerAddresses[ownerId-1];
    }


    function endTurn() public onlyPlayer gameIsOn ItIsPlayerTurn {
        require(playerHasChoice == true, "Player must have choice");
        playerTurn = (playerTurn) % 4 + 1;
        playerThrown = false;
    }


    function getHouses() public view returns (House[] memory) {
        return houses;
    }

    function getAllPlayerPositions() public view returns (uint8[] memory) {
        uint8[] memory positions = new uint8[](playerCount);

        for (uint8 i = 0; i < playerCount; i++) {
            positions[i] = players[playerAddresses[i]].playerPosition;
        }

        return positions;
    }
    
    function transferTokens(address _from, address _to, uint256 _value) private returns (bool success) {
        require(_from != address(0), "Invalid 'from' address");
        require(_to != address(0), "Invalid 'to' address");
        require(_value > 0, "Invalid token amount");

        // Check if the sender has enough tokens
        require(moneyPolyContract.balanceOf(_from) >= _value, "Insufficient token balance");

        // Transfer tokens from the sender to the receiver
        moneyPolyContract.transfer(_to, _value);

        return true;
    }

}
