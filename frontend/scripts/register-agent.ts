import { registerAgent } from "../lib/erc8004";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Registering agent on ERC-8004 Registry...");
  const tokenId = await registerAgent();
  console.log(`\n✅ Registration successful!`);
  console.log(`Add this to your .env.local:`);
  console.log(`AGENT_TOKEN_ID=${tokenId}`);
}

main().catch(console.error);
