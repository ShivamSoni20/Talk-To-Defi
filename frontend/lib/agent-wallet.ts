import { ethers } from "ethers";

export function getAgentWallet() {
  const provider = new ethers.JsonRpcProvider(
    process.env.FUJI_RPC_URL!,
    {
      chainId: parseInt(process.env.FUJI_CHAIN_ID!),
      name: "avalanche-fuji"
    }
  );
  const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY!, provider);
  return { wallet, provider };
}

export async function getAgentBalance() {
  const { wallet, provider } = getAgentWallet();
  const avaxBalance = await provider.getBalance(wallet.address);
  return ethers.formatEther(avaxBalance);
}
