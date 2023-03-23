// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MoneyPoly is ERC20, ERC20Burnable {
    constructor() ERC20("MoneyPoly", "MPL") {}

    function mintTokens(address _to) public {
       _mint(_to, 50000);
      //  _mint(_to, 50000 * 10 ** decimals());
    }

    function burnAll(address account) public {
        _burn(account, balanceOf(account));
    }

    function burn(address account, uint256 amount) public {
    _burn(account, amount);
    }

}