const deployWNFT = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { firstAccount } = await getNamedAccounts();

  log("Deploying WrappedMyToken contract...");
  const wnft = await deploy("WrappedMyToken", {
    from: firstAccount,
    log: true,
    contract: "WrappedMyToken",
    args: ["WrappedMyToken", "WMTK"],
  });
  log("WrappedMyToken deployed to:", wnft.address);
};

deployWNFT.tags = ["destinationchain", "all"];

export default deployWNFT;
