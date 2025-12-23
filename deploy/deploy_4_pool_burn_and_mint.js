import hre from "hardhat";

const deployNFTPoolBurnAndMint = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { firstAccount } = await getNamedAccounts();

  log("Deploying NFTPoolBurnAndMint contract...");

  const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
  const ccipSimulator = await hre.ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address);
  const ccipConfig = await ccipSimulator.configuration();
  const destinationRouter = ccipConfig.destinationRouter_;
  const linkToken = ccipConfig.linkToken_;
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
