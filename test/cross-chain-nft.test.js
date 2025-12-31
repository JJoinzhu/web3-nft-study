import hre from "hardhat";
import { expect } from "chai";

let firstAccount;
let ccipSimulator;
let nft;
let NFTPoolLockAndRelease;
let wrappedNft;
let NFTPoolBurnAndMint;
let chainSelector;

before(async function () {
  const account = await hre.getNamedAccounts();
  firstAccount = account.firstAccount;
  await hre.deployments.fixture(["all"]);
  ccipSimulator = await hre.ethers.getContract("CCIPLocalSimulator", firstAccount);
  nft = await hre.ethers.getContract("MyToken", firstAccount);
  NFTPoolLockAndRelease = await hre.ethers.getContract("NFTPoolLockAndRelease", firstAccount);
  wrappedNft = await hre.ethers.getContract("WrappedMyToken", firstAccount);
  NFTPoolBurnAndMint = await hre.ethers.getContract("NFTPoolBurnAndMint", firstAccount);
  const config = await ccipSimulator.configuration();
  chainSelector = config.chainSelector_;
});

// source chain -> destination chain
describe("source chain -> destination chain", function () {
  it("1. test if user can mint an NFT on source chain", async function () {
    await nft.safeMint(firstAccount);
    expect(await nft.ownerOf(0)).to.equal(firstAccount);
  });

  it("2. test if user can lock an NFT on source chain and send ccip message to destination chain", async function () {
    await nft.approve(NFTPoolLockAndRelease.target, 0);
    await ccipSimulator.requestLinkFromFaucet(NFTPoolLockAndRelease, hre.ethers.parseEther("10"));
    await NFTPoolLockAndRelease.lockAndSendNFT(0, firstAccount, chainSelector, NFTPoolBurnAndMint.target);
    const owner = await nft.ownerOf(0);
    expect(owner).to.equal(NFTPoolLockAndRelease);
  });

  it("3. test if user can get wrapped NFT on destination chain", async function () {
    const owner = await wrappedNft.ownerOf(0);
    expect(owner).to.equal(firstAccount);
  });
});

// destination chain -> source chain
describe("destination chain -> source chain", function () {
  it("1. test if user can burn an NFT on destination chain and send ccip message to source chain", async function () {
    await wrappedNft.approve(NFTPoolBurnAndMint.target, 0);
    await ccipSimulator.requestLinkFromFaucet(NFTPoolBurnAndMint, hre.ethers.parseEther("10"));
    await NFTPoolBurnAndMint.burnAndSendNFT(0, firstAccount, chainSelector, NFTPoolLockAndRelease.target);
    const totalSupply = await wrappedNft.totalSupply();
    expect(totalSupply).to.equal(0);
  });

  it("2. test if user can unlock an NFT on source chain", async function () {
    const owner = await nft.ownerOf(0);
    expect(owner).to.equal(firstAccount);
  });
});
