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
});
