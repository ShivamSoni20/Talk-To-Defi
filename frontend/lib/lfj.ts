import { ethers } from "ethers";
import { getAgentWallet } from "./agent-wallet";

const LFJ_ROUTER_ABI = [
  `function swapExactAVAXForTokens(
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
  ) external payable returns (uint256[] memory amounts)`,

  `function swapExactTokensForAVAX(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] calldata path,
    address to,
    uint256 deadline
  ) external returns (uint256[] memory amounts)`,

  `function getAmountsOut(
    uint256 amountIn,
    address[] calldata path
  ) external view returns (uint256[] memory amounts)`
];

const WAVAX_FUJI = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";

export async function swapAVAXToUSDC(avaxAmount: number): Promise<{
  txHash: string;
  amountIn: number;
  amountOut: number;
}> {
  const { wallet } = getAgentWallet();
  const router = new ethers.Contract(process.env.LFJ_ROUTER!, LFJ_ROUTER_ABI, wallet);

  const amountInWei = ethers.parseEther(avaxAmount.toString());
  const path = [WAVAX_FUJI, process.env.USDC_ADDRESS!];

  const amounts = await router.getAmountsOut(amountInWei, path);
  const amountOutMin = (amounts[1] * BigInt(99)) / BigInt(100);

  const deadline = Math.floor(Date.now() / 1000) + 300;

  const tx = await router.swapExactAVAXForTokens(
    amountOutMin,
    path,
    wallet.address,
    deadline,
    {
      value: amountInWei,
      gasLimit: 400_000
    }
  );

  const receipt = await tx.wait();
  const usdcReceived = Number(ethers.formatUnits(amounts[1], 6));

  return {
    txHash: receipt.hash,
    amountIn: avaxAmount,
    amountOut: usdcReceived
  };
}
