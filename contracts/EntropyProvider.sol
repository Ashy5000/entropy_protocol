// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

import "./EntropyConsumer.sol";
import "./EntropyProtocol.sol";

interface EntropyProvider {
    function pullTo(EntropyConsumer consumer) external;
}

contract MultiContribProvider is EntropyProvider {
    EntropyConsumer[] waitingConsumers;
    uint256 slashThreshold = 10;

    function commit(EntropyProtocol protocol) public {
        assert(waitingConsumers.length < slashThreshold);
        protocol.pushCommit();
    }

    function pullTo(EntropyConsumer consumer) public override {
        waitingConsumers.push(consumer);
    }

    function supply(uint256 data) public {
        waitingConsumers[0].pushTo(data);
        delete waitingConsumers[0];
    }
}
