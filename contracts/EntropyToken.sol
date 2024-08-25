// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./EntropyProtocol.sol";

contract EntropyToken is ERC20 {
    address owner;
    uint256 stakingFraction;
    uint256 slashingFraction;
    mapping(address => uint256) stakedTokens;

    constructor(
        uint256 totalSupply,
        address allocationAddress
    ) public ERC20("Entropy Protocol", "ENTP") {
        owner = msg.sender;
        stakingFraction = 10000; // 0.01% return per block of entropy
        slashingFraction = 10; // 10% slashing per failure to resolve commit
        _mint(allocationAddress, totalSupply);
    }

    function stake(uint256 amount) public {
        assert(balanceOf(msg.sender) >= amount);
        _burn(msg.sender, amount);
        stakedTokens[msg.sender] += amount;
    }

    function unstake(uint256 amount, EntropyProtocol protocol) public {
        assert(protocol.canUnstake(msg.sender));
        assert(stakedBalanceOf(msg.sender) >= amount);
        stakedTokens[msg.sender] -= amount;
        _mint(msg.sender, amount);
    }

    function stakedBalanceOf(address provider) public view returns (uint256) {
        return stakedTokens[provider];
    }

    function payoutStakingReward(address provider) public {
        assert(msg.sender == owner);
        stakedTokens[provider] += stakedBalanceOf(provider) / stakingFraction;
    }

    function slash(address provider) public {
        assert(msg.sender == owner);
        stakedTokens[provider] -= stakedBalanceOf(provider) / slashingFraction;
    }

    function payForEntropy(address consumer, uint256 poolSize) public {
        assert(msg.sender == owner);
        uint256 base = poolSize * 1_00000000000000000;
        _burn(consumer, base / 100); // Burn 0.01 tokens
    }
}
