// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

interface EntropyConsumer {
    function pushTo(uint256 data) external;
}

interface EntropyProvider {
    function pullTo(EntropyConsumer consumer) external;
}

contract ExampleProvider is EntropyProvider {
    function pullTo(EntropyConsumer consumer) public {
        consumer.pushTo(1234); // TEST ONLY
        // TODO: wait for contribution, then push to consumer
    }
}

contract PoolConsumer is EntropyConsumer {
    event newData(uint256 body);

    function pushTo(uint256 data) public {
        emit newData(data);
    }
}

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
        uint i = queue.length - 1;
        uint consumed = 0;
        while(consumed < poolSize) {
            if(!queue[i].depleted) {
                queue[i].provider.pullTo(consumer);
                consumed++;
                queue[i].depleted = true;
            }
            i--;
        }
    }
}
