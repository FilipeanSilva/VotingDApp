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

  describe('Voting Timer and Status Checks', function () {
    it('should correctly calculate remaining time during voting', async function () {
      // Setup: Add candidates and start voting
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);

      // Assert: Remaining time should be close to the original duration
      let remainingTime = await voting.getRemainingTime();
      assert.isAbove(
        remainingTime.toNumber(),
        990,
        'Remaining time should be close to 1000 seconds'
      );

      // Simulate time passing
      await network.provider.send('evm_increaseTime', [500]);
      await network.provider.send('evm_mine');

      // Assert: Remaining time should be roughly half the original duration
      remainingTime = await voting.getRemainingTime();
      assert.isAbove(
        remainingTime.toNumber(),
        490,
        'Remaining time should be close to 500 seconds'
      );
      assert.isBelow(
        remainingTime.toNumber(),
        510,
        'Remaining time should be close to 500 seconds'
      );
    });

    it('should return 0 remaining time if voting has ended', async function () {
      // Setup: Add candidates and start voting
      await voting.connect(owner).addCandidates(['Alice', 'Bob']);
      await voting.connect(owner).startVotingProcess(1000);

      // Simulate time passing to end voting
      await network.provider.send('evm_increaseTime', [1001]);
      await network.provider.send('evm_mine');

      // Assert: Remaining time should be 0 after voting has ended
      const remainingTime = await voting.getRemainingTime();
      assert.equal(
        remainingTime.toNumber(),
        0,
        'Remaining time should be 0 after voting ends'
      );
    });
  });
});
