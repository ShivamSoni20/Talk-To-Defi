import { ethers } from "ethers";
import { getAgentWallet } from "./agent-wallet";

const QI_TOKEN_ABI = [
  "function mint(uint256 mintAmount) external returns (uint256)",
  "function redeem(uint256 redeemTokens) external returns (uint256)",
  "function redeemUnderlying(uint256 redeemAmount) external returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function exchangeRateCurrent() external returns (uint256)",
  "function supplyRatePerTimestamp() external view returns (uint256)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

export async function supplyUSDC(amountUSD: number): Promise<{
  txHash: string;
  blockNumber: number;
  amountSupplied: number;
}> {
  const { wallet } = getAgentWallet();

  const usdcContract = new ethers.Contract(
    process.env.USDC_ADDRESS!,
    ERC20_ABI,
    wallet
  );

  const qiUSDCContract = new ethers.Contract(
    process.env.BENQI_QIUSDC!,
    QI_TOKEN_ABI,
    wallet
  );

  const amountRaw = ethers.parseUnits(amountUSD.toFixed(6), 6);

  const currentAllowance = await usdcContract.allowance(wallet.address, process.env.BENQI_QIUSDC!);
  if (currentAllowance < amountRaw) {
    const approveTx = await usdcContract.approve(process.env.BENQI_QIUSDC!, amountRaw);
    await approveTx.wait();
    console.log("USDC approved for BENQI");
  }

  const mintTx = await qiUSDCContract.mint(amountRaw, {
    gasLimit: 500_000
  });

  const receipt = await mintTx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    amountSupplied: amountUSD
  };
}

export async function getBENQISupplyAPY(): Promise<number> {
  const { wallet } = getAgentWallet();
  const qiUSDC = new ethers.Contract(process.env.BENQI_QIUSDC!, QI_TOKEN_ABI, wallet);

  const ratePerTimestamp = await qiUSDC.supplyRatePerTimestamp();
  const secondsPerYear = 31_536_000;
  const apy = (Number(ratePerTimestamp) / 1e18) * secondsPerYear * 100;
  return parseFloat(apy.toFixed(2));
}
