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
    event VotingEnded(uint256 endTime);

    // Define constant error messages
    string public constant ERROR_ONLY_OWNER =
        "Only the owner can perform this action.";
    string public constant ERROR_VOTING_ALREADY_STARTED =
        "Voting process has already started.";
    string public constant ERROR_VOTING_NOT_STARTED =
        "Voting process has not started yet.";
    string public constant ERROR_VOTING_ENDED = "Voting has already ended.";
    string public constant ERROR_ALREADY_VOTED = "You have already voted.";
    string public constant ERROR_CANDIDATE_EXISTS =
        "Candidate with this name already exists.";
    string public constant ERROR_INVALID_CANDIDATE = "Invalid candidate index.";
    string public constant ERROR_NO_CANDIDATES =
        "Must have at least one candidate.";
    string public constant ERROR_CANNOT_MODIFY_CANDIDATES =
        "Cannot modify candidates after voting has started.";

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, ERROR_ONLY_OWNER);
        _;
    }

    function addCandidates(string[] memory _names) public onlyOwner {
        require(votingStart == 0, ERROR_CANNOT_MODIFY_CANDIDATES);

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
            require(!isDuplicate, ERROR_CANDIDATE_EXISTS);
            candidates.push(Candidate({name: newCandidateName, voteCount: 0}));
            emit CandidateAdded(newCandidateName);
        }
    }

    function excludeCandidate(uint256 _candidateIndex) public onlyOwner {
        require(votingStart == 0, ERROR_CANNOT_MODIFY_CANDIDATES);
        require(_candidateIndex < candidates.length, ERROR_INVALID_CANDIDATE);

        // Move the last candidate to the position of the candidate to remove
        candidates[_candidateIndex] = candidates[candidates.length - 1];
        candidates.pop();
    }

    function startVotingProcess(uint256 _durationInSeconds) public onlyOwner {
        require(votingStart == 0, ERROR_VOTING_ALREADY_STARTED);
        require(candidates.length > 0, ERROR_NO_CANDIDATES);

        votingStart = block.timestamp;
        votingEnd = block.timestamp + _durationInSeconds;
        emit VotingStarted(votingStart, votingEnd);
    }

    function vote(uint256 _candidateIndex) public {
        require(
            votingStart > 0 && block.timestamp >= votingStart,
            ERROR_VOTING_NOT_STARTED
        );

        if (block.timestamp >= votingEnd) {
            emit VotingEnded(votingEnd);
            revert(ERROR_VOTING_ENDED);
        }

        require(!voters[msg.sender], ERROR_ALREADY_VOTED);
        require(_candidateIndex < candidates.length, ERROR_INVALID_CANDIDATE);

        voters[msg.sender] = true;
        candidates[_candidateIndex].voteCount++;
        emit VoteCast(msg.sender, _candidateIndex);
    }

    function getCandidate(
        uint256 index
    ) public view returns (string memory, uint256) {
        require(index < candidates.length, ERROR_INVALID_CANDIDATE);
        Candidate memory candidate = candidates[index];
        return (candidate.name, candidate.voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (VotingStatus) {
        if (votingStart == 0) return VotingStatus.NotStarted;
        if (block.timestamp >= votingEnd) return VotingStatus.Ended;
        return VotingStatus.Ongoing;
    }

    function getRemainingTime() public view returns (uint256) {
        if (getVotingStatus() != VotingStatus.Ongoing) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function endVoting() public {
        require(block.timestamp >= votingEnd, "Voting is still ongoing.");
        emit VotingEnded(votingEnd);

        // Optionally, reset voting start to indicate voting has ended
        votingStart = 0;
    }
}
