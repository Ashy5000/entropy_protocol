// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./EntropyConsumer.sol";

interface EntropyProvider {
    function pullTo(EntropyConsumer consumer) external;
}

contract MultiContribProvider is EntropyProvider {
    EntropyConsumer[] waitingConsumers;

    function pullTo(EntropyConsumer consumer) public {
        waitingConsumers.push(consumer);
    }

    function supply(uint256 data) public {
        waitingConsumers[0].pushTo(data);
        delete waitingConsumers[0];
    }
}
