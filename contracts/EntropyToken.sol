// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EntropyToken is ERC20 {
    address owner;
    uint256 stakingFraction;
    uint256 slashingFraction;

    constructor(
        uint256 totalSupply,
        address allocationAddress
    ) public ERC20("Entropy Protocol", "ENTP") {
        owner = msg.sender;
        stakingFraction = 10000; // 0.01% return per block of entropy
        slashingFraction = 10; // 10% slashing per failure to resolve commit
        _mint(allocationAddress, totalSupply);
    }

    function payoutStakingReward(address provider) public {
        assert(msg.sender == owner);
        _mint(provider, balanceOf(provider) / stakingFraction);
    }

    function slash(address provider) public {
        assert(msg.sender == owner);
        _burn(provider, balanceOf(provider) / slashingFraction);
    }
}
