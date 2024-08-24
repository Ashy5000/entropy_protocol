// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

interface EntropyConsumer {
    function pushTo(uint256 data) external;
}

contract PoolConsumer is EntropyConsumer {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    struct RecordInfo {
        address consumer;
    }

    struct Records {
        mapping(address => RecordInfo[]) debtListings;
    }

    Records records;
    uint256 slashThreshold = 10;

    function prepare(address provider, address consumer) public returns (bool) {
        assert(owner == msg.sender);
        RecordInfo memory record;
        record.consumer = consumer;
        records.debtListings[provider].push(record);
        return records.debtListings[provider].length > slashThreshold;
    }

    function pushTo(uint256 data) public override {
        assert(records.debtListings[msg.sender].length != 0);
        EntropyConsumer consumer = EntropyConsumer(
            records.debtListings[msg.sender][0].consumer
        );
        consumer.pushTo(data);
        delete records.debtListings[msg.sender][0];
    }
}

contract EndConsumer is EntropyConsumer {
    event newBlock(uint256 dataBlock);

    uint256[] data;

    function getLastBlock() public view returns (uint256) {
        return data[data.length - 1];
    }

    function pushTo(uint256 dataBlock) public override {
        emit newBlock(dataBlock);
        data.push(dataBlock);
    }
}
