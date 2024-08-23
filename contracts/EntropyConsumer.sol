// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

interface EntropyConsumer {
    function pushTo(uint256 data) external;
}

contract PoolConsumer is EntropyConsumer {
    event newData(uint256 body);

    function pushTo(uint256 data) public {
        emit newData(data);
    }
}
