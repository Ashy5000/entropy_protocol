// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

import "./EntropyConsumer.sol";
import "./EntropyProvider.sol";
import "./EntropyToken.sol";

contract EntropyProtocol {
    struct QueueElement {
        EntropyProvider provider;
        bool depleted;
        uint256 finalData;
        uint256 hash;
    }

    QueueElement[] queue;
    PoolConsumer router;
    EntropyToken token;
    uint256 minimumStake;

    constructor() {
        router = new PoolConsumer();
        token = new EntropyToken(1_000_000_00000000000000000, msg.sender); // 1 million tokens with 18-decimal subdivision
        minimumStake = 1_00000000000000000; // 1 token with 18-decimal subdivision
    }

    function getToken() public view returns (EntropyToken) {
        return token;
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

    function canUnstake(address provider) public view returns (bool) {
        for (uint256 i; i < queue.length; i++) {
            if (!queue[i].depleted) {
                if (address(queue[i].provider) == address(provider)) {
                    return false;
                }
            }
        }
        return true;
    }

    function pushCommit(uint256 hash) public {
        QueueElement memory elem;
        assert(token.stakedBalanceOf(msg.sender) >= minimumStake);
        EntropyProvider provider = EntropyProvider(msg.sender);
        elem.provider = provider;
        elem.depleted = false;
        elem.finalData = 0;
        elem.hash = hash;
        queue.push(elem);
    }

    function pullEntropy(uint256 poolSize, EntropyConsumer consumer) public {
        uint i = 0;
        uint consumed = 0;
        token.payForEntropy(address(consumer), poolSize);
        while (consumed < poolSize) {
            if (!queue[i].depleted) {
                bool slash = router.prepare(
                    address(queue[i].provider),
                    address(consumer),
                    queue[i].hash
                );
                if (slash) {
                    token.slash(address(queue[i].provider));
                } else {
                    token.payoutStakingReward(address(queue[i].provider));
                }
                queue[i].provider.pullTo(router);
                consumed++;
                queue[i].depleted = true;
            }
            i++;
        }
    }
}
