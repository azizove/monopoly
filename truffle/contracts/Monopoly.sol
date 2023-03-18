// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Monopoly {

    struct Player {
        uint256 position;
        uint256 playerNumber;
        // Ajouter d'autres informations sur le joueur ici si nécessaire
    }

    uint256 public playerCount = 0;
    mapping(address => Player) public players;
    bool public gameOn = false;

    event NewPlayer(address indexed player, uint256 indexed number);

    function assignPlayerNumber() public {
        require(players[msg.sender].playerNumber == 0, "Player already has a number");
        require(playerCount < 4, "Maximum number of players reached");

        playerCount++;
        players[msg.sender].playerNumber = playerCount;
        emit NewPlayer(msg.sender, playerCount);

        if (playerCount == 4) {
            gameOn = true;
        }
    }

    // Ajouter d'autres fonctions pour la logique du jeu ici




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
}
