// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./EntropyConsumer.sol";
import "./EntropyProvider.sol";

contract EntropyProtocol {
    struct QueueElement {
        EntropyProvider provider;
        bool depleted;
        uint256 finalData;
    }

    QueueElement[] queue;
    PoolConsumer router;

    constructor() {
        router = new PoolConsumer();
    }

    function activeQueueSize() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i; i < queue.length; i++) {
            if (!queue[i].depleted) {
                count++;
            }
        }
        return count;
    }

    function pushCommit() public {
        QueueElement memory elem;
        EntropyProvider provider = EntropyProvider(msg.sender);
        elem.provider = provider;
        elem.depleted = false;
        elem.finalData = 0;
        queue.push(elem);
    }

    function pullEntropy(uint256 poolSize, EntropyConsumer consumer) public {
        uint i = 0;
        uint consumed = 0;
        while (consumed < poolSize) {
            if (!queue[i].depleted) {
                router.prepare(address(queue[i].provider), address(consumer));
                queue[i].provider.pullTo(router);
                consumed++;
                queue[i].depleted = true;
            }
            i++;
        }
    }
}
