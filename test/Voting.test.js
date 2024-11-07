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

  describe('Owner Functions', function () {
    it('should allow owner to add candidates', async function () {
      // Act: Owner adds candidates
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);

      // Assert: Verify the correct number and names of candidates
      const candidates = await voting.getAllCandidates();
      assert.equal(candidates.length, 2, 'Two candidates should be added');
      assert.equal(
        candidates[0].name,
        'Alice',
        'First candidate should be Alice'
      );
      assert.equal(candidates[1].name, 'Bob', 'Second candidate should be Bob');
    });

    it('should allow owner to start voting', async function () {
      // Setup: Add candidates and start voting
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);

      // Assert: Verify that voting status is updated
      const status = await voting.getVotingStatus();
      assert.equal(status, 1, 'Voting should be ongoing');
    });

    it('should prevent adding candidates after voting has started', async function () {
      // Setup: Add candidates and start voting
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);

      // Act & Assert: Try adding a candidate after voting started
      try {
        await voting.connect(owner).addCandidates(['Charlie']);
        assert.fail(
          'Adding candidates after voting started should throw an error'
        );
      } catch (error) {
        assert(
          error.message.includes(
            'Cannot modify candidates after voting has started.'
          ),
          "Error should match 'Cannot modify candidates' restriction"
        );
      }
    });

    it('should allow owner to exclude a candidate before voting starts', async function () {
      // Setup: Add candidates
      await voting.connect(owner).addCandidates(['Alice', 'Bob', 'Charlie']);

      // Act: Exclude 'Bob'
      await voting.connect(owner).excludeCandidate(1);

      // Assert: Verify the candidate list after exclusion
      const candidates = await voting.getAllCandidates();
      assert.equal(
        candidates.length,
        2,
        'There should be 2 candidates after exclusion'
      );
      assert.notEqual(
        candidates[0].name,
        'Bob',
        'First candidate should not be Bob'
      );
      assert.notEqual(
        candidates[1].name,
        'Bob',
        'Second candidate should not be Bob'
      );
    });

    it('should revert if trying to exclude a candidate with an invalid index', async function () {
      // Setup: Add candidates
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);

      // Act & Assert: Try excluding a candidate with an invalid index
      try {
        await voting.connect(owner).excludeCandidate(2);
        assert.fail('Excluding a non-existing candidate should throw an error');
      } catch (error) {
        assert(
          error.message.includes('Invalid candidate index.'),
          "Error should match 'Invalid candidate index' restriction"
        );
      }
    });

    it('should prevent ending the voting process prematurely', async function () {
      // Setup: Add candidates and start voting
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);

      // Act & Assert: Try ending voting before it's complete
      try {
        await voting.connect(owner).endVoting();
        assert.fail('Ending voting before it has ended should throw an error');
      } catch (error) {
        assert(
          error.message.includes('Cannot end voting process while ongoing'),
          "Error should match 'Cannot end voting' restriction"
        );
      }
    });
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

  describe('General Checks', function () {
    it('should allow checking candidate details by index', async function () {
      // Setup: Add a candidate
      await voting.connect(owner).addCandidates(['Alice']);

      // Act: Retrieve candidate details
      const [name, voteCount] = await voting.getCandidate(0);

      // Assert: Verify the candidate details
      assert.equal(name, 'Alice', 'The candidate name should be Alice');
      assert.equal(voteCount, 0, 'Initial vote count should be 0');
    });

    it('should prevent non-owner from adding candidates', async function () {
      // Act & Assert: User1 tries to add a candidate
      try {
        await voting.connect(user1).addCandidates(['David']);
        assert.fail('Non-owner adding candidates should throw an error');
      } catch (error) {
        assert(
          error.message.includes('Only the owner can perform this action.'),
          `Expected error message to include 'Only the owner can perform this action.', but got: ${error.message}`
        );
      }
    });

    it('should allow getting voting status', async function () {
      // Assert: Check initial voting status
      let status = await voting.getVotingStatus();
      assert.equal(status, 0, 'Voting status should be NotStarted initially');

      // Act: Start the voting process and verify the status
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);
      status = await voting.getVotingStatus();
      assert.equal(status, 1, 'Voting status should be Ongoing after starting');

      // Simulate time passing to end voting and verify status
      await network.provider.send('evm_increaseTime', [1001]);
      await network.provider.send('evm_mine');
      status = await voting.getVotingStatus();
      assert.equal(
        status,
        2,
        'Voting status should be Ended after time passes'
      );
    });

    it('should handle an empty candidate list gracefully', async function () {
      // Assert: Check behavior when no candidates are present
      const candidates = await voting.getAllCandidates();
      assert.equal(
        candidates.length,
        0,
        'No candidates should be present initially'
      );
    });
  });
});
