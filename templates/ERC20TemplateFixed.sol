// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title {{CLASS_NAME}}
 * @dev ERC-20 token with minting, burning, and ownership controls.
 * Initial supply is hard-coded at 20,000,000 tokens.
 */
contract {{CLASS_NAME}} is ERC20, Ownable {
    constructor() ERC20("{{TOKEN_NAME}}", "{{TOKEN_SYMBOL}}") {
        uint256 initialSupply = {{INITIAL_SUPPLY}};
        _mint(msg.sender, initialSupply);
    }

    /**
     * @notice Mint new tokens (owner only)
     * @param to Address to receive minted tokens
     * @param amountInUSD Amount in whole tokens (will be multiplied by decimals)
     */
    function mint(address to, uint256 amountInUSD) external onlyOwner {
        uint256 amount = amountInUSD * 10 ** uint256(decimals());
        _mint(to, amount);
    }

    /**
     * @notice Burn tokens from caller's balance
     * @param amountInUSD Amount in whole tokens to burn
     */
    (uint256 amountInUSD) external {
        _burn(msg.sender, amount);
    }

    /**
     * @notice Burn tokens from a specific address (with allowance)
     * @param from Address to burn tokens from
     * @param amountInUSD Amount in whole tokens to burn
     */
    function burnFrom(address from, uint256 amountInUSD) external {
        uint256 amount = amountInUSD * 10 ** uint256(decimals());
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
    }
}
