// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address immutable owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;
    bool public votingStarted = false;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    function addCandidates(string[] memory _names) public onlyOwner {
        require(
            !votingStarted,
            "Cannot add candidates after voting has started."
        );
        for (uint256 i = 0; i < _names.length; i++) {
            candidates.push(Candidate({name: _names[i], voteCount: 0}));
        }
    }

    function excludeCandidate(uint256 _candidateIndex) public onlyOwner {
        require(
            !votingStarted,
            "Cannot exclude candidates after voting has started."
        );
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );

        // Move the last candidate to the position of the candidate to remove
        candidates[_candidateIndex] = candidates[candidates.length - 1];
        candidates.pop();
    }

    function startVotingProcess(uint256 _durationInSeconds) public onlyOwner {
        require(!votingStarted, "Voting process has already started.");
        require(candidates.length > 0, "Must have at least one candidate.");
        votingStart = block.timestamp;
        votingEnd = block.timestamp + _durationInSeconds;
        votingStarted = true;
    }

    function vote(uint256 _candidateIndex) public {
        require(votingStarted, "Voting process has not started yet.");
        require(
            block.timestamp >= votingStart && block.timestamp < votingEnd,
            "Voting is not active."
        );
        require(!voters[msg.sender], "You have already voted.");
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );

        voters[msg.sender] = true;
        candidates[_candidateIndex].voteCount++;
    }

    function getCandidate(
        uint256 index
    ) public view returns (string memory, uint256) {
        require(index < candidates.length, "Invalid candidate index.");
        Candidate memory candidate = candidates[index];
        return (candidate.name, candidate.voteCount);
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return
            votingStarted &&
            block.timestamp >= votingStart &&
            block.timestamp < votingEnd;
    }

    function getRemainingTime() public view returns (uint256) {
        require(votingStarted, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }
}
