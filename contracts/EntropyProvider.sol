// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

import "./EntropyConsumer.sol";
import "./EntropyProtocol.sol";
import "./EntropyToken.sol";

interface EntropyProvider {
    function pullTo(EntropyConsumer consumer) external;
}

contract MultiContribProvider is EntropyProvider {
    EntropyConsumer[] waitingConsumers;
    uint256 slashThreshold = 10;

    function stake(EntropyToken token, uint256 amount) public {
        // Stake tokens sent to the MultiContribProvider
        assert(token.balanceOf(address(this)) >= amount);
        token.stake(amount);
    }

    function commit(EntropyProtocol protocol, uint256 hash) public {
        assert(waitingConsumers.length < slashThreshold);
        protocol.pushCommit(hash);
    }

    function pullTo(EntropyConsumer consumer) public override {
        waitingConsumers.push(consumer);
    }

    function supply(uint256 data) public {
        waitingConsumers[0].pushTo(data);
        delete waitingConsumers[0];
    }
}
