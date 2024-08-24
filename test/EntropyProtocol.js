require("mocha");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Protocol", function () {
  async function deployProtocolFixture() {
    const Factory = await ethers.getContractFactory("EntropyProtocol");
    const protocol = await Factory.deploy();
    return { protocol };
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
      const { protocol } = await loadFixture(deployProtocolFixture);
      const size = await protocol.activeQueueSize();
      expect(size).to.equal(BigInt(0));
    });
    it("adds an entropy block to the queue when pushCommit() is called", async function () {
      const { protocol } = await loadFixture(deployProtocolFixture);
      const initialSize = await protocol.activeQueueSize();
      await protocol.pushCommit();
      const finalSize = await protocol.activeQueueSize();
      expect(finalSize).to.equal(initialSize + BigInt(1));
    });
  });
  describe("Pulling", function () {
    it("removes commits from the queue when entropy is pulled", async function () {
      const { protocol } = await loadFixture(deployProtocolFixture);
      const { consumer } = await loadFixture(deployConsumerFixture);
      const { provider } = await loadFixture(deployProviderFixture);
      await provider.commit(protocol);
      const initialSize = await protocol.activeQueueSize();
      await protocol.pullEntropy(1, consumer);
      const finalSize = await protocol.activeQueueSize();
      expect(finalSize).to.equal(initialSize - BigInt(1));
    });
    it("gets the correct data when pulling entropy", async function () {
      const { protocol } = await loadFixture(deployProtocolFixture);
      const { consumer } = await loadFixture(deployConsumerFixture);
      const { provider } = await loadFixture(deployProviderFixture);
      await provider.commit(protocol); // Commit
      await protocol.pullEntropy(1, consumer); // Request entropy
      await provider.supply(1234); // Supply entropy
      const result = await consumer.getLastBlock();
      expect(result).to.equal(1234);
    });
  });
});
