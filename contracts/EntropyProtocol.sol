// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./EntropyConsumer.sol";
import "./EntropyProvider.sol";

contract EntropyProtocol {
    struct QueueElement {
        EntropyProvider provider;
        bool depleted;
    }

    QueueElement[] queue;

    function pushCommit() public {
        QueueElement memory elem;
        EntropyProvider provider = EntropyProvider(msg.sender);
        elem.provider = provider;
        elem.depleted = false;
        queue.push(elem);
    }

    function pullEntropy(uint256 poolSize, EntropyConsumer consumer) public {
        uint i = 0;
        uint consumed = 0;
        while (consumed < poolSize) {
            if (!queue[i].depleted) {
                queue[i].provider.pullTo(consumer);
                consumed++;
                queue[i].depleted = true;
            }
            i++;
        }
    }
}
