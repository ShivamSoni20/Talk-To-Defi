// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockLFJRouter {
    address public usdc;
    uint256 public constant AVAX_PRICE_USDC = 38500000; // $38.5 in 6 decimals

    constructor(address _usdc) {
        usdc = _usdc;
    }

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts) {
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        // 1 AVAX = 38.5 USDC
        // amountIn is 18 decimals, we want 6 decimals out
        amounts[1] = (amountIn * AVAX_PRICE_USDC) / 1e18;
    }

    function swapExactAVAXForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts) {
        require(block.timestamp <= deadline, "Expired");
        
        uint256 amountOut = (msg.value * AVAX_PRICE_USDC) / 1e18;
        require(amountOut >= amountOutMin, "Insufficient output amount");
        
        IERC20(usdc).transfer(to, amountOut);
        
        amounts = new uint256[](2);
        amounts[0] = msg.value;
        amounts[1] = amountOut;
    }

    // Allow contract to receive AVAX
    receive() external payable {}
}
