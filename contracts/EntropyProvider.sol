// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./EntropyConsumer.sol";

interface EntropyProvider {
    function pullTo(EntropyConsumer consumer) external;
}

contract MultiContribProvider is EntropyProvider {
    EntropyConsumer[] waitingConsumers;
    uint256 slashThreshold = 10;

    function pullTo(EntropyConsumer consumer) public {
        assert(waitingConsumers.length < slashThreshold); // Don't accept new requests if it would lead to slashing
        waitingConsumers.push(consumer);
    }

    function supply(uint256 data) public {
        waitingConsumers[0].pushTo(data);
        delete waitingConsumers[0];
    }
}
