// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title {{CLASS_NAME}}
 * @dev ERC-20 token with minting, and ownership controls.
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
