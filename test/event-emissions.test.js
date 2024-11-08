const { ethers, network } = require('hardhat');
const { assert, expect } = require('chai');

describe('Voting Contract', function () {
  // Variables for the contract and users used in testing
  let Voting, voting, owner, user1, user2;

  // Runs before each test, deploying a new contract instance
  beforeEach(async function () {
    const signers = await ethers.getSigners();
    [owner, user1, user2] = signers; // Assign owner and two users

    // Deploy the Voting contract
    Voting = await ethers.getContractFactory('Voting');
    voting = await Voting.deploy();
    await voting.deployed();
  });

  describe('Voting Event Emissions', function () {
    it('should emit CandidateAdded event when adding a candidate', async function () {
      // Act: Add candidate and log event details
      const tx = await voting.connect(owner).addCandidates(['Alice']);
      const receipt = await tx.wait();

      // Assert: Verify the event was emitted with correct arguments
      const event = receipt.events.find((e) => e.event === 'CandidateAdded');
      assert(event, 'CandidateAdded event should be emitted');
      assert.equal(event.args.name, 'Alice', 'Candidate name should be Alice');
    });

    it('should emit VotingStarted event when voting starts', async function () {
      // Setup: Add candidates
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);

      // Act: Start voting process and log event details
      const tx = await voting.connect(owner).startVotingProcess(1000);
      const receipt = await tx.wait();

      // Assert: Verify the event was emitted with correct arguments
      const event = receipt.events.find((e) => e.event === 'VotingStarted');
      assert(event, 'VotingStarted event should be emitted');
      assert.equal(
        event.args.start.toString(),
        (await voting.votingStart()).toString(),
        'Voting start time should match'
      );
      assert.equal(
        event.args.end.toString(),
        (await voting.votingEnd()).toString(),
        'Voting end time should match'
      );
    });

    it('should emit VoteCast event when a user votes', async function () {
      // Setup: Add candidates and start voting
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);

      // Act: User1 votes and log event details
      const tx = await voting.connect(user1).vote(0);
      const receipt = await tx.wait();

      // Assert: Verify the event was emitted with correct arguments
      const event = receipt.events.find((e) => e.event === 'VoteCast');
      assert(event, 'VoteCast event should be emitted');
      assert.equal(
        event.args.voter,
        user1.address,
        'Voter address should match user1'
      );
      assert.equal(
        event.args.candidateIndex.toString(),
        '0',
        'Candidate index should be 0'
      );
    });
  });
});
