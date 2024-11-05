const { ethers } = require('hardhat');

describe('Voting Contract', function () {
  let Voting;
  let voting;
  let owner;
  let addr1;

  beforeEach(async function () {
    Voting = await ethers.getContractFactory('Voting');
    [owner, addr1] = await ethers.getSigners();
    voting = await Voting.deploy();
    await voting.deployed();
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const contractOwner = await voting.owner();
      if (contractOwner !== owner.address) {
        throw new Error('Owner is not set correctly');
      }
    });
  });

  describe('Candidates', function () {
    it('Should add candidates', async function () {
      await voting.addCandidates(['Alice', 'Bob']);
      const candidates = await voting.getAllCandidates();
      if (candidates.length !== 2) {
        throw new Error('Candidate count is incorrect');
      }
      if (candidates[0].name !== 'Alice') {
        throw new Error('First candidate name is incorrect');
      }
      if (candidates[1].name !== 'Bob') {
        throw new Error('Second candidate name is incorrect');
      }
    });

    it('Should not allow duplicate candidates', async function () {
      await voting.addCandidates(['Alice']);
      try {
        await voting.addCandidates(['Alice']);
        throw new Error('Expected error not received');
      } catch (err) {
        if (err.message !== 'Candidate with this name already exists.') {
          throw new Error('Unexpected error message: ' + err.message);
        }
      }
    });

    it('Should not modify candidates after voting starts', async function () {
      await voting.addCandidates(['Alice']);
      await voting.startVotingProcess(60);
      try {
        await voting.addCandidates(['Bob']);
        throw new Error('Expected error not received');
      } catch (err) {
        if (
          err.message !== 'Cannot modify candidates after voting has started.'
        ) {
          throw new Error('Unexpected error message: ' + err.message);
        }
      }
    });
  });

  // Continue adding tests for startVotingProcess, vote, etc.
});
