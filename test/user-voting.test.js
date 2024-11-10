const { ethers, network } = require('hardhat');
const { assert } = require('chai');

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

  describe('User Voting', function () {
    it('should allow a user to cast a vote', async function () {
      // Setup: Add candidates and start voting
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);

      // Act: User1 casts a vote for Alice (index 0)
      await voting.connect(user1).vote(0);

      // Assert: Check the vote count for Alice
      const [_, voteCount] = await voting.getCandidate(0);
      assert.equal(voteCount, 1, 'Alice should have 1 vote');
    });

    it('should prevent double voting by the same user', async function () {
      // Setup: Add candidates and start voting
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);

      // Act: User1 votes once, then tries to vote again
      await voting.connect(user1).vote(0);
      try {
        await voting.connect(user1).vote(0);
        assert.fail('Double voting should throw an error');
      } catch (error) {
        assert(
          error.message.includes('You have already voted.'),
          "Error should match 'already voted' restriction"
        );
      }
    });

    it('should prevent voting if the voting period has ended', async function () {
      // Setup: Add candidates and start a short voting process
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1); // Short voting duration

      // Simulate time passing to end voting
      await network.provider.send('evm_increaseTime', [2]);
      await network.provider.send('evm_mine');

      // Act & Assert: Try voting after the voting period ended
      try {
        await voting.connect(user1).vote(0);
        assert.fail('Voting after the voting period should throw an error');
      } catch (error) {
        assert(
          error.message.includes('Voting has already ended.'),
          `Expected error message to include 'Voting has already ended.', but got: ${error.message}`
        );
      }
    });
  });
});
