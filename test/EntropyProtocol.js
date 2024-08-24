require("mocha");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Protocol", function () {
  async function deployProtocolFixture() {
    const Factory = await ethers.getContractFactory("EntropyProtocol");
    const [owner] = await ethers.getSigners();
    const protocol = await Factory.deploy();
    return { protocol, owner };
  }
  describe("Commitment", function () {
    it("begins with no commits in the queue", async function () {
      const { protocol, owner } = await loadFixture(deployProtocolFixture);
      const size = await protocol.activeQueueSize();
      expect(size).to.equal(BigInt(0));
    });
    it("adds an entropy block to the queue when pushCommit() is called", async function () {
      const { protocol, owner } = await loadFixture(deployProtocolFixture);
      const initialSize = await protocol.activeQueueSize();
      await protocol.pushCommit();
      const finalSize = await protocol.activeQueueSize();
      expect(finalSize).to.equal(initialSize + BigInt(1));
    });
  });
});
