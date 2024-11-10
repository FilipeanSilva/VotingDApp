const { ethers } = require('hardhat');
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

  describe('Invalid Operations and Edge Cases', function () {
    it('should prevent non-owner from starting the voting process', async function () {
      // Setup: Add candidates
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);

      // Act & Assert: User1 tries to start the voting process
      try {
        await voting.connect(user1).startVotingProcess(1000);
        assert.fail('Non-owner starting voting should throw an error');
      } catch (error) {
        assert(
          error.message.includes('Only the owner can perform this action.'),
          `Expected error message to include 'Only the owner can perform this action.', but got: ${error.message}`
        );
      }
    });

    it('should prevent voting if no candidates have been added', async function () {
      // Act & Assert: Try starting the voting process without adding candidates
      try {
        await voting.connect(owner).startVotingProcess(1000);
        assert.fail('Starting voting without candidates should throw an error');
      } catch (error) {
        assert(
          error.message.includes('Must have at least one candidate.'),
          `Expected error message to include 'Must have at least one candidate.', but got: ${error.message}`
        );
      }
    });

    it('should prevent duplicate candidate names from being added', async function () {
      // Act: Add duplicate candidates
      await voting.connect(owner).addCandidates(['Alice']);
      try {
        await voting.connect(owner).addCandidates(['Alice']);
        assert.fail('Adding duplicate candidate should throw an error');
      } catch (error) {
        assert(
          error.message.includes('Candidate with this name already exists.'),
          `Expected error message to include 'Candidate with this name already exists.', but got: ${error.message}`
        );
      }
    });
  });
});
