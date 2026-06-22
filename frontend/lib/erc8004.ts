import { ethers } from "ethers";
import { getAgentWallet } from "./agent-wallet";

const IDENTITY_ABI = [
  "function registerAgent(string memory metadataURI) external returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function totalSupply() external view returns (uint256)"
];

const REPUTATION_ABI = [
  "function submitFeedback(uint256 agentId, uint8 score, string memory evidenceURI) external",
  "function getReputation(uint256 agentId) external view returns (uint256 totalScore, uint256 count)",
  "function getFeedbackCount(uint256 agentId) external view returns (uint256)"
];

export function getIdentityRegistry() {
  const { wallet } = getAgentWallet();
  return new ethers.Contract(
    process.env.IDENTITY_REGISTRY!,
    IDENTITY_ABI,
    wallet
  );
}

export function getReputationRegistry() {
  const { wallet } = getAgentWallet();
  return new ethers.Contract(
    process.env.REPUTATION_REGISTRY!,
    REPUTATION_ABI,
    wallet
  );
}

export async function registerAgent(): Promise<number> {
  const registry = getIdentityRegistry();
  const metadataURI = "https://your-app.vercel.app/agent-metadata.json";

  const tx = await registry.registerAgent(metadataURI, { gasLimit: 500000 });
  const receipt = await tx.wait();

  const transferEvent = receipt.logs.find(
    (log: any) => log.topics[0] === ethers.id("Transfer(address,address,uint256)")
  );
  const tokenId = parseInt(transferEvent.topics[3], 16);
  console.log(`Agent registered! Token ID: ${tokenId}`);
  return tokenId;
}

export async function getAgentReputation(tokenId: number) {
  const registry = getReputationRegistry();
  const [totalScore, count] = await registry.getReputation(tokenId);
  const avgScore = count > 0 ? Number(totalScore) / Number(count) : 0;
  return { totalScore: Number(totalScore), count: Number(count), avgScore };
}

export async function submitProtocolFeedback(
  protocolScore: number,
  txHash: string
) {
  const registry = getReputationRegistry();
  const evidenceURI = `https://testnet.snowtrace.io/tx/${txHash}`;

  const agentTokenId = parseInt(process.env.AGENT_TOKEN_ID!);
  const tx = await registry.submitFeedback(agentTokenId, protocolScore, evidenceURI, { gasLimit: 300000 });
  await tx.wait();
  console.log("Reputation updated onchain");
}
