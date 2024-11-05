const { ethers, network } = require("hardhat");
const { assert } = require("chai");

describe("Voting Contract", function () {
  let Voting, voting, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners(); // Ensure both owner and user are signers
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(); // Owner deploys the contract
    await voting.deployed();
  });

  it("should allow owner to add candidates", async function () {
    await voting.addCandidates(["Alice", "Bob"]);
    const candidates = await voting.getAllCandidates();
    assert.equal(candidates.length, 2, "Two candidates should be added");
    assert.equal(candidates[0].name, "Alice", "First candidate should be Alice");
    assert.equal(candidates[1].name, "Bob", "Second candidate should be Bob");
  });

  it("should allow owner to start voting", async function () {
    await voting.addCandidates(["Alice", "Bob"]);
    await voting.startVotingProcess(1000);

    const status = await voting.getVotingStatus();
    assert.equal(status, 1, "Voting should be ongoing");
  });

  it("should allow user to cast a vote", async function () {
    await voting.addCandidates(["Alice", "Bob"]);
    await voting.startVotingProcess(1000);

    // Use explicit `getSigner` to ensure `user` is correctly treated as a signer
    await voting.connect(ethers.provider.getSigner(user.address)).vote(0);
    const [_, voteCount] = await voting.getCandidate(0);
    assert.equal(voteCount, 1, "Alice should have 1 vote");
  });

  it("should prevent double voting by the same user", async function () {
    await voting.addCandidates(["Alice", "Bob"]);
    await voting.startVotingProcess(1000);

    await voting.connect(ethers.provider.getSigner(user.address)).vote(0);
    try {
      await voting.connect(ethers.provider.getSigner(user.address)).vote(0);
      assert.fail("Double voting should throw an error");
    } catch (error) {
      assert(
        error.message.includes("You have already voted."),
        "Error should match 'already voted' restriction"
      );
    }
  });

  it("should allow owner to end voting by mocking time", async function () {
    await voting.addCandidates(["Alice", "Bob"]);
    await voting.startVotingProcess(1); // Set a short duration for quick testing

    // Move time forward to simulate the voting period ending
    await network.provider.send("evm_increaseTime", [2]);
    await network.provider.send("evm_mine");

    await voting.endVoting();
    const status = await voting.getVotingStatus();
    assert.equal(status, 2, "Voting should be ended");
  });
});
