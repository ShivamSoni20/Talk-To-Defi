import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying mock contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy MockUSDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("MockUSDC deployed to:", usdcAddress);

  // 2. Deploy MockLFJRouter
  const MockLFJRouter = await ethers.getContractFactory("MockLFJRouter");
  const router = await MockLFJRouter.deploy(usdcAddress);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("MockLFJRouter deployed to:", routerAddress);

  // 3. Deploy MockBENQI
  const MockBENQI = await ethers.getContractFactory("MockBENQI");
  const benqi = await MockBENQI.deploy(usdcAddress);
  await benqi.waitForDeployment();
  const benqiAddress = await benqi.getAddress();
  console.log("MockBENQI deployed to:", benqiAddress);

  // 4. Deploy MockERC8004
  const MockERC8004 = await ethers.getContractFactory("MockERC8004");
  const erc8004 = await MockERC8004.deploy();
  await erc8004.waitForDeployment();
  const erc8004Address = await erc8004.getAddress();
  console.log("MockERC8004 deployed to:", erc8004Address);

  // Mint initial USDC to the router so it can pay out swaps
  console.log("Minting 100,000 USDC to LFJ Router...");
  const tx1 = await usdc.mint(routerAddress, ethers.parseUnits("100000", 6));
  await tx1.wait();
  
  // Mint some USDC to the deployer just in case
  console.log("Minting 10,000 USDC to Agent...");
  const tx2 = await usdc.mint(deployer.address, ethers.parseUnits("10000", 6));
  await tx2.wait();

  // Register Agent in ERC8004 to get Token ID 1
  console.log("Registering agent in ERC8004...");
  const tx3 = await erc8004.registerAgent("ipfs://mock");
  await tx3.wait();
  console.log("Agent registered. Token ID: 1");

  console.log("Deployment complete! Update frontend/.env.local with:");
  console.log(`USDC_ADDRESS=${usdcAddress}`);
  console.log(`LFJ_ROUTER=${routerAddress}`);
  console.log(`BENQI_QIUSDC=${benqiAddress}`);
  console.log(`IDENTITY_REGISTRY=${erc8004Address}`);
  console.log(`REPUTATION_REGISTRY=${erc8004Address}`);
  console.log(`AGENT_TOKEN_ID=1`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
