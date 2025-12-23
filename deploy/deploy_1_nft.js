const deployNFT = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { firstAccount } = await getNamedAccounts();

  log("Deploying MyToken contract...");
  const nft = await deploy("MyToken", {
    from: firstAccount,
    log: true,
    contract: "MyToken",
    args: ["MyToken", "MTK"],
  });
  log("MyToken deployed to:", nft.address);
};

deployNFT.tags = ["sourcechain", "all"];

export default deployNFT;
