const { ethers, network } = require('hardhat');
const { assert } = require('chai');

//! The tests can only pass when .env file has working keys and the network is running 
describe('Voting Contract', function () {
  let Voting, voting, owner, user;
  
  beforeEach(async function () {
    const signers = await ethers.getSigners();

    [owner] = signers;

    Voting = await ethers.getContractFactory('Voting');
    voting = await Voting.deploy();
    await voting.deployed();
  });

  it('should allow owner to add candidates', async function () {
    await voting.addCandidates(['Alice', 'Bob']);
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
    await voting.addCandidates(['Alice', 'Bob']);
    await voting.startVotingProcess(1000);

    const status = await voting.getVotingStatus();
    assert.equal(status, 1, 'Voting should be ongoing');
  });

  it('should allow user to cast a vote', async function () {
    await voting.addCandidates(['Alice', 'Bob']);
    await voting.startVotingProcess(1000);

    // Explicitly ensure `user` is connected as a signer
    const userSigner = ethers.provider.getSigner(owner.address);
    await voting.connect(userSigner).vote(0);

    const [_, voteCount] = await voting.getCandidate(0);
    assert.equal(voteCount, 1, 'Alice should have 1 vote');
  });

  it('should prevent double voting by the same user', async function () {
    await voting.addCandidates(['Alice', 'Bob']);
    await voting.startVotingProcess(1000);

    await voting.connect(ethers.provider.getSigner(owner.address)).vote(0);
    try {
      await voting.connect(ethers.provider.getSigner(owner.address)).vote(0);
      assert.fail('Double voting should throw an error');
    } catch (error) {
      assert(
        error.message.includes('You have already voted.'),
        "Error should match 'already voted' restriction"
      );
    }
  });
});
