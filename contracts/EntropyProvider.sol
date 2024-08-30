// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";
import "./EntropyConsumer.sol";
import "./EntropyProtocol.sol";
import "./EntropyToken.sol";

interface EntropyProvider {
    function pullTo(EntropyConsumer consumer) external;
}

contract MultiContribProvider is EntropyProvider {
    EntropyConsumer[] waitingConsumers;
    uint256 slashThreshold = 10;
    address owner;

    // Sign Protocol instance
    // Ethereum Sepolia: 0x878c92FD89d8E0B93Dc0a3c907A2adc7577e39c5
    // Ethereum Mainnet: 0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD
    ISP public spInstance;
    bool instanceLocked = false;

    // Schema ID
    // Ethereum Sepolia: 0x6b
    uint64 public schemaId;
    bool schemaIdLocked = false;

    constructor() {
        owner = msg.sender;
    }

    function setAndLockSpInstance(address spInstanceAddress) public {
        assert(msg.sender == owner);
        assert(!instanceLocked);
        spInstance = ISP(spInstanceAddress);
        instanceLocked = true;
    }

    function setAndLockSchemaId(uint64 id) public {
        assert(msg.sender == owner);
        assert(!schemaIdLocked);
        schemaId = id;
        schemaIdLocked = true;
    }

    function stake(EntropyToken token, uint256 amount) public {
        // Stake tokens sent to the MultiContribProvider
        assert(token.balanceOf(address(this)) >= amount);
        token.stake(amount);
    }

    function commit(address protocol, uint256 hash) public {
        //assert(waitingConsumers.length < slashThreshold);
        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(protocol);
        Attestation memory attestation = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: abi.encode(hash)
        });
        spInstance.attest(attestation, "", "", "");
    }

    function pullTo(EntropyConsumer consumer) public override {
        waitingConsumers.push(consumer);
    }

    function supply(uint256 data) public {
        waitingConsumers[0].pushTo(data);
        delete waitingConsumers[0];
    }
}

contract SingleContribProvider is EntropyProvider {
    EntropyConsumer[] waitingConsumers;
    uint256 slashThreshold = 10;
    address owner;

    // Sign Protocol instance
    // Ethereum Sepolia: 0x878c92FD89d8E0B93Dc0a3c907A2adc7577e39c5
    // Ethereum Mainnet: 0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD
    ISP public spInstance;
    bool instanceLocked = false;

    // Schema ID
    // Ethereum Sepolia: 0x6b
    uint64 public schemaId;
    bool schemaIdLocked = false;

    constructor() {
        owner = msg.sender;
    }

    function setAndLockSpInstance(address spInstanceAddress) public {
        assert(msg.sender == owner);
        assert(!instanceLocked);
        spInstance = ISP(spInstanceAddress);
        instanceLocked = true;
    }

    function setAndLockSchemaId(uint64 id) public {
        assert(msg.sender == owner);
        assert(!schemaIdLocked);
        schemaId = id;
        schemaIdLocked = true;
    }

    function stake(EntropyToken token, uint256 amount) public {
        // Stake tokens sent to the SingleContribProvider
        assert(msg.sender == owner);
        token.stake(amount);
    }

    function unstake(
        EntropyToken token,
        address protocol,
        uint256 amount
    ) public {
        assert(msg.sender == owner);
        token.unstake(amount, EntropyProtocol(protocol));
    }

    function withdraw(EntropyToken token, uint256 amount) public {
        assert(msg.sender == owner);
        token.transfer(owner, amount);
    }

    function commit(address protocol, uint256 hash) public {
        assert(msg.sender == owner);
        assert(waitingConsumers.length < slashThreshold);
        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(protocol);
        Attestation memory attestation = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: abi.encode(hash)
        });
        spInstance.attest(attestation, "", "", "");
    }

    function pullTo(EntropyConsumer consumer) public override {
        waitingConsumers.push(consumer);
    }

    function supply(uint256 data) public {
        assert(msg.sender == owner);
        waitingConsumers[0].pushTo(data);
        delete waitingConsumers[0];
    }
}
