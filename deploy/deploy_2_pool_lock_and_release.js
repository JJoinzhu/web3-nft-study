import hre from "hardhat";
import { developmentChains, networkConfig } from "../helper-hardhat-config.js";

const deployNFTPoolLockAndRelease = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { firstAccount } = await getNamedAccounts();

  log("Deploying NFTPoolLockAndRelease contract...");
  let sourceRouter, linkToken;

  console.log(hre.network.name, hre.network.config.chainId);

  if (developmentChains.includes(hre.network.name)) {
    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
    const ccipSimulator = await hre.ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address);
    const ccipConfig = await ccipSimulator.configuration();
    sourceRouter = ccipConfig.sourceRouter_;
    linkToken = ccipConfig.linkToken_;
  } else {
    sourceRouter = networkConfig[hre.network.config.chainId].sourceRouter;
    linkToken = networkConfig[hre.network.config.chainId].linkToken;
  }

  const nftDeployment = await deployments.get("MyToken");
  const nftAddr = nftDeployment.address;

  const pool = await deploy("NFTPoolLockAndRelease", {
    from: firstAccount,
    log: true,
    contract: "NFTPoolLockAndRelease",
    args: [sourceRouter, linkToken, nftAddr],
  });

  log("NFTPoolLockAndRelease deployed to:", pool.address);
};

deployNFTPoolLockAndRelease.tags = ["sourcechain", "all"];

export default deployNFTPoolLockAndRelease;
