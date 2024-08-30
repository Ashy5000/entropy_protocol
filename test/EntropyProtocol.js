require("mocha");
var Web3 = require("web3");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const fs = require("fs");

describe("Protocol", function () {
  async function deployProtocolFixture() {
    const abiString = fs.readFileSync("test/protocolabi.json");
    const abi = JSON.parse(abiString);
    const [owner] = await ethers.getSigners();
    const protocol = new ethers.Contract(
      "0x4a7f8abdae59f7aaf4b6d8629314b32e968b4c0d",
      abi,
      owner,
    );
    return { protocol, owner };
  }
  async function deployConsumerFixture() {
    const Factory = await ethers.getContractFactory("EndConsumer");
    const consumer = await Factory.deploy();
    return { consumer };
  }
  async function deployProviderFixture() {
    const Factory = await ethers.getContractFactory("MultiContribProvider");
    const provider = await Factory.deploy();
    return { provider };
  }
  describe("Commitment", function () {
    it("begins with no commits in the queue", async function () {
      const { protocol } = await deployProtocolFixture();
      const size = await protocol.activeQueueSize();
      expect(size).to.equal(BigInt(0));
    });
    it("adds an entropy block to the queue when pushCommit() is called", async function () {
      const { protocol, owner } = await loadFixture(deployProtocolFixture);
      await protocol.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      const { provider } = await loadFixture(deployProviderFixture);
      await provider.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      await provider.setAndLockSchemaId(0x79);
      const abiString = fs.readFileSync("test/erc20abi.json");
      const abi = JSON.parse(abiString);
      const tokenAddress = await protocol.getToken();
      const token = new ethers.Contract(tokenAddress, abi, owner);
      await token.transfer(provider, BigInt(2_000000000000000) * BigInt(1000));
      await provider.stake(
        tokenAddress,
        BigInt(2_000000000000000) * BigInt(1000),
      );
      const initialSize = await protocol.activeQueueSize();
      await provider.commit(
        "0x4a7f8abdae59f7aaf4b6d8629314b32e968b4c0d",
        BigInt(0),
      );
      const finalSize = await protocol.activeQueueSize();
      expect(finalSize).to.equal(initialSize + BigInt(1));
    });
  });
  describe("Pulling", function () {
    it("removes commits from the queue when entropy is pulled", async function () {
      const { protocol, owner } = await loadFixture(deployProtocolFixture);
      await protocol.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      const { consumer } = await loadFixture(deployConsumerFixture);
      const { provider } = await loadFixture(deployProviderFixture);
      await provider.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      await provider.setAndLockSchemaId(0x79);
      const abiString = fs.readFileSync("test/erc20abi.json");
      const abi = JSON.parse(abiString);
      const tokenAddress = await protocol.getToken();
      const token = new ethers.Contract(tokenAddress, abi, owner);
      await token.transfer(provider, BigInt(2_000000000000000) * BigInt(1000));
      await provider.stake(
        tokenAddress,
        BigInt(2_000000000000000) * BigInt(1000),
      );
      await token.transfer(consumer, BigInt(1_000000000000000) * BigInt(1000));
      await provider.commit(protocol, BigInt(0));
      const initialSize = await protocol.activeQueueSize();
      await protocol.pullEntropy(1, consumer);
      const finalSize = await protocol.activeQueueSize();
      expect(finalSize).to.equal(initialSize - BigInt(1));
    });
    it("gets the correct data when pulling entropy", async function () {
      const { protocol, owner } = await loadFixture(deployProtocolFixture);
      await protocol.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      const { consumer } = await loadFixture(deployConsumerFixture);
      const { provider } = await loadFixture(deployProviderFixture);
      await provider.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      await provider.setAndLockSchemaId(0x79);
      const abiString = fs.readFileSync("test/erc20abi.json");
      const abi = JSON.parse(abiString);
      const tokenAddress = await protocol.getToken();
      const token = new ethers.Contract(tokenAddress, abi, owner);
      await token.transfer(provider, BigInt(2_000000000000000) * BigInt(100));
      await token.transfer(consumer, BigInt(1_000000000000000));
      await provider.stake(token, BigInt(2_000000000000000) * BigInt(100));
      const hash = Web3.utils.soliditySha3(1234);
      await provider.commit(protocol, hash); // Commit
      await protocol.pullEntropy(1, consumer); // Request entropy
      await provider.supply(1234); // Supply entropy
      const result = await consumer.getLastBlock();
      expect(result).to.equal(1234);
    });
    it("charges the consumer the correct fee", async function () {
      const { protocol, owner } = await loadFixture(deployProtocolFixture);
      await protocol.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      const { consumer } = await loadFixture(deployConsumerFixture);
      const { provider } = await loadFixture(deployProviderFixture);
      await provider.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      await provider.setAndLockSchemaId(0x79);
      const abiString = fs.readFileSync("test/erc20abi.json");
      const abi = JSON.parse(abiString);
      const tokenAddress = await protocol.getToken();
      const token = new ethers.Contract(tokenAddress, abi, owner);
      await token.transfer(provider, BigInt(2_000000000000000) * BigInt(100));
      await token.transfer(consumer, BigInt(1_000000000000000));
      await provider.stake(token, BigInt(2_000000000000000) * BigInt(100));
      const hash = Web3.utils.soliditySha3(1234);
      await provider.commit(protocol, hash); // Commit
      await protocol.pullEntropy(1, consumer); // Request entropy
      await provider.supply(1234); // Supply entropy
      const consumerBalance = await token.balanceOf(consumer);
      expect(consumerBalance).to.equal(0);
    });
  });
  describe("Staking", function () {
    it("Rewards providers correctly", async function () {
      const { protocol, owner } = await loadFixture(deployProtocolFixture);
      await protocol.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      const { consumer } = await loadFixture(deployConsumerFixture);
      const { provider } = await loadFixture(deployProviderFixture);
      await provider.setAndLockSpInstance(
        "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
      );
      await provider.setAndLockSchemaId(0x79);
      const abiString = fs.readFileSync("test/erc20abi.json");
      const abi = JSON.parse(abiString);
      const tokenAddress = await protocol.getToken();
      const token = new ethers.Contract(tokenAddress, abi, owner);
      await token.transfer(provider, BigInt(2_000000000000000) * BigInt(100));
      await token.transfer(consumer, BigInt(1_000000000000000));
      await provider.stake(token, BigInt(2_000000000000000) * BigInt(100));
      const initialBalance = await token.stakedBalanceOf(provider);
      const hash = Web3.utils.soliditySha3(1234);
      await provider.commit(protocol, hash); // Commit
      await protocol.pullEntropy(1, consumer); // Request entropy
      const finalBalance = await token.stakedBalanceOf(provider);
      expect(finalBalance).to.be.greaterThan(initialBalance);
    });
  });
});
