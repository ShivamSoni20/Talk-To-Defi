// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC8004 is ERC721 {
    uint256 private _nextTokenId = 1;
    
    struct Reputation {
        uint256 totalScore;
        uint256 count;
    }
    
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Reputation) public reputations;

    constructor() ERC721("Agent Registry", "AGENT") {}

    // Identity Registry Methods
    function registerAgent(string memory metadataURI) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _tokenURIs[tokenId] = metadataURI;
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    // Reputation Registry Methods
    function submitFeedback(uint256 agentId, uint8 score, string memory evidenceURI) external {
        require(score <= 100, "Score must be <= 100");
        reputations[agentId].totalScore += score;
        reputations[agentId].count += 1;
    }

    function getReputation(uint256 agentId) external view returns (uint256 totalScore, uint256 count) {
        Reputation memory rep = reputations[agentId];
        return (rep.totalScore, rep.count);
    }
}
