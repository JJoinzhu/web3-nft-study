import hre from "hardhat";

const deployNFTPoolLockAndRelease = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { firstAccount } = await getNamedAccounts();

  log("Deploying NFTPoolLockAndRelease contract...");

  const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
  const ccipSimulator = await hre.ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address);
  const ccipConfig = await ccipSimulator.configuration();
  const sourceRouter = ccipConfig.sourceRouter_;
  const linkToken = ccipConfig.linkToken_;
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
