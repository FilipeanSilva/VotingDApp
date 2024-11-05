// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public immutable owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    enum VotingStatus {
        NotStarted,
        Ongoing,
        Ended
    }

    event CandidateAdded(string name);
    event VotingStarted(uint256 start, uint256 end);
    event VoteCast(address voter, uint256 candidateIndex);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    function addCandidates(string[] memory _names) public onlyOwner {
        require(
            votingStart == 0,
            "Cannot add candidates after voting has started."
        );

        for (uint256 i = 0; i < _names.length; i++) {
            string memory newCandidateName = _names[i];

            // Check if the candidate name already exists in the candidates array
            bool isDuplicate = false;
            for (uint256 j = 0; j < candidates.length; j++) {
                if (
                    keccak256(abi.encodePacked(candidates[j].name)) ==
                    keccak256(abi.encodePacked(newCandidateName))
                ) {
                    isDuplicate = true;
                    break;
                }
            }

            // If the candidate is not a duplicate, add it
            require(!isDuplicate, "Candidate with this name already exists.");
            candidates.push(Candidate({name: newCandidateName, voteCount: 0}));
            emit CandidateAdded(newCandidateName);
        }
    }

    function excludeCandidate(uint256 _candidateIndex) public onlyOwner {
        require(
            votingStart == 0,
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
        require(votingStart == 0, "Voting process has already started.");
        require(candidates.length > 0, "Must have at least one candidate.");

        votingStart = block.timestamp;
        votingEnd = block.timestamp + _durationInSeconds;
        emit VotingStarted(votingStart, votingEnd);
    }

    function vote(uint256 _candidateIndex) public {
        require(
            votingStart > 0 && block.timestamp >= votingStart,
            "Voting process has not started yet."
        );
        require(block.timestamp < votingEnd, "Voting has already ended.");
        require(!voters[msg.sender], "You have already voted.");
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );

        voters[msg.sender] = true;
        candidates[_candidateIndex].voteCount++;
        emit VoteCast(msg.sender, _candidateIndex);
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

    function getVotingStatus() public view returns (VotingStatus) {
        if (votingStart == 0) {
            return VotingStatus.NotStarted;
        } else if (
            block.timestamp >= votingStart && block.timestamp < votingEnd
        ) {
            return VotingStatus.Ongoing;
        } else {
            return VotingStatus.Ended;
        }
    }

    function getRemainingTime() public view returns (uint256) {
        if (getVotingStatus() != VotingStatus.Ongoing) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }
}
