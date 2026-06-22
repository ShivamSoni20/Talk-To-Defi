// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockBENQI is ERC20 {
    address public underlying;
    uint256 public ratePerTimestamp = 171232876; // Approx 5.4% APY in 1e18

    constructor(address _underlying) ERC20("Mock BENQI USDC", "qiUSDC") {
        underlying = _underlying;
    }

    function mint(uint256 mintAmount) external returns (uint256) {
        require(IERC20(underlying).transferFrom(msg.sender, address(this), mintAmount), "Transfer failed");
        // 1:1 exchange rate for simplicity in mock
        _mint(msg.sender, mintAmount);
        return 0;
    }

    function supplyRatePerTimestamp() external view returns (uint256) {
        return ratePerTimestamp;
    }
}
