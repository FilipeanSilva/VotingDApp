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
