import hre from "hardhat";
import { developmentChains } from "../helper-hardhat-config.js";

const deployCCIPSimulator = async ({ deployments, getNamedAccounts }) => {
  if (developmentChains.includes(hre.network.name)) {
    const { deploy, log } = deployments;
    const { firstAccount } = await getNamedAccounts();

    log("Deploying ccip simulator contract...");
    const ccipSimulator = await deploy("CCIPLocalSimulator", {
      from: firstAccount,
      log: true,
      contract: "CCIPLocalSimulator",
      args: [],
    });
    log("CCIPSimulator deployed to:", ccipSimulator.address);
  }
};

deployCCIPSimulator.tags = ["test", "all"];

export default deployCCIPSimulator;
