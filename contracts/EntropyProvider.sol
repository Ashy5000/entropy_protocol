// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./EntropyConsumer.sol";

interface EntropyProvider {
    function pullTo(EntropyConsumer consumer) external;
}

contract ExampleProvider is EntropyProvider {
    function pullTo(EntropyConsumer consumer) public {
        consumer.pushTo(1234); // TEST ONLY
        // TODO: wait for contribution, then push to consumer
    }
}
