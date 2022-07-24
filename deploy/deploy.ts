import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";
import verify from "../helper-functions";

// Deployment
const deployToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const developmentChains = ["hardhat", "localhost"];

  // from hardhat-config
  const { deployments, network } = hre;
  const { log } = deployments;
  log(
    "------------------------- TheToken Deployment ---------------------------"
  );
  const VerifyVoucher = await ethers.getContractFactory("VerifyVoucher");
  const verifyVoucher = await upgrades.deployProxy(VerifyVoucher, []);

  const TheToken = await ethers.getContractFactory("TheToken");
  const token = await upgrades.deployProxy(TheToken, [verifyVoucher.address]);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(token.address, [], "contracts/TheToken.sol:TheToken");
  }
  log(`TheToken deployed at: ${token.address}`);
};

export default deployToken;
