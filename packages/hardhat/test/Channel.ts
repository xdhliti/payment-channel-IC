import { expect } from "chai";
import { ethers } from "hardhat";
import { Channel } from "../typechain-types";
import { Signer } from "ethers";

describe("Channel Contract", function () {
  let channel: Channel;
  let sender: Signer;
  let recipientAddress: string;
  let recipient: Signer;
  let timeout: number;
  let margin: bigint;
  let tip: string;

  before(async function () {
    [sender, recipient] = await ethers.getSigners();
    recipientAddress = await recipient.getAddress();
    timeout = 24 * 60 * 60; // 1 day in seconds
    margin = ethers.parseEther("1"); // 1 Ether in Wei
    tip = ethers.keccak256(ethers.toUtf8Bytes("secret"));
  });

  beforeEach(async function () {
    const ChannelFactory = await ethers.getContractFactory("Channel");
    channel = (await ChannelFactory.deploy(recipientAddress, timeout, margin, tip, { value: margin })) as Channel;
  });

  it("should allow the recipient to close the channel correctly", async function () {
    // Assume a correct word and word count scenario
    const correctWord = "secret";
    const wordCount = 1;

    // Hashing the word to match the tip
    const wordHash = ethers.keccak256(ethers.toUtf8Bytes(correctWord));

    // The recipient closes the channel
    await expect(channel.connect(recipient).closeChannel(wordHash, wordCount))
      .to.emit(channel, "Transfer")
      .withArgs(recipientAddress, wordCount * Number(margin));

    // Check if the channel is deactivated
    expect(await channel.isActive()).to.equal(false);
  });

  it("should expire correctly", async function () {
    // Fast-forward time to simulate channel expiration
    await ethers.provider.send("evm_increaseTime", [timeout + 1]);
    await ethers.provider.send("evm_mine", []);

    // The sender expires the channel
    await channel.expireChannel();

    // Check if the channel is deactivated
    expect(await channel.isActive()).to.equal(false);

    // The sender should be able to recover the funds
    // This part assumes the initial balance of the contract is equal to the margin
    // and that all funds are returned to the sender on expiration
    await expect(() => channel.expireChannel()).to.changeEtherBalances(
      [channel, sender],
      [-Number(margin), Number(margin)],
    );
  });

  // Additional tests can be added to cover more scenarios
});
