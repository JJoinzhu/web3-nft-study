import hre from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config.js";

const deployNFTPoolBurnAndMint = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { firstAccount } = await getNamedAccounts();

  log("Deploying NFTPoolBurnAndMint contract...");

  let destinationRouter, linkToken;
  if (developmentChains.includes(hre.network.name)) {
    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
    const ccipSimulator = await hre.ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address);
    const ccipConfig = await ccipSimulator.configuration();
    destinationRouter = ccipConfig.destinationRouter_;
    linkToken = ccipConfig.linkToken_;
  } else {
    destinationRouter = networkConfig[hre.network.config.chainId].sourceRouter;
    linkToken = networkConfig[hre.network.config.chainId].linkToken;
  }

  const wnftDeployment = await deployments.get("WrappedMyToken");
  const wnftAddr = wnftDeployment.address;

  const pool = await deploy("NFTPoolBurnAndMint", {
    from: firstAccount,
    log: true,
    contract: "NFTPoolBurnAndMint",
    args: [destinationRouter, linkToken, wnftAddr],
  });

  log("NFTPoolBurnAndMint deployed to:", pool.address);
};

deployNFTPoolBurnAndMint.tags = ["destinationchain", "all"];

export default deployNFTPoolBurnAndMint;
