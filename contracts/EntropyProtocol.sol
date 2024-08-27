// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.20 <0.9.0;

import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";
import "./EntropyConsumer.sol";
import "./EntropyProvider.sol";
import "./EntropyToken.sol";

contract EntropyProtocol {
    struct QueueElement {
        // EntropyProvider provider;
        // bool depleted;
        // uint256 finalData;
        // uint256 hash;
        uint64 attestationId;
        bool depleted;
    }

    // Sign Protocol instance
    // Ethereum Sepolia: 0x878c92FD89d8E0B93Dc0a3c907A2adc7577e39c5
    // Ethereum Mainnet: 0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD
    ISP public spInstance;
    bool instanceLocked = false;
    // Schema ID
    // Ethereum Sepolia: 0x6b
    uint64 public schemaId;
    bool schemaIdLocked = false;

    QueueElement[] queue;
    PoolConsumer router;
    EntropyToken token;
    uint256 minimumStake;
    address owner;

    constructor() {
        owner = msg.sender;
        router = new PoolConsumer();
        token = new EntropyToken(1_000_000_00000000000000000, owner); // 1 million tokens with 18-decimal subdivision
        minimumStake = 1_00000000000000000; // 1 token with 18-decimal subdivision
        spInstance = ISP(0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD);
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
            Attestation memory commit = spInstance.getAttestation(
                queue[i].attestationId
            );
            address activeProvider = abi.decode(
                commit.recipients[0],
                (address)
            );
            if (!queue[i].depleted) {
                if (activeProvider == address(provider)) {
                    return false;
                }
            }
        }
        return true;
    }

    function pushCommit(uint256 hash) public {
        QueueElement memory elem;
        assert(token.stakedBalanceOf(msg.sender) >= minimumStake);
        bytes[] memory recipients = new bytes[](1);
        recipients[0] = abi.encode(msg.sender);
        Attestation memory commit = Attestation({
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
        elem.attestationId = spInstance.attest(commit, "", "", "");
        queue.push(elem);
    }

    function pullEntropy(uint256 poolSize, EntropyConsumer consumer) public {
        uint i = 0;
        uint consumed = 0;
        token.payForEntropy(address(consumer), poolSize);
        while (consumed < poolSize) {
            Attestation memory commit = spInstance.getAttestation(
                queue[i].attestationId
            );
            address provider = abi.decode(commit.recipients[0], (address));
            uint256 hash = abi.decode(commit.data, (uint256));
            if (!queue[i].depleted) {
                bool slash = router.prepare(provider, address(consumer), hash);
                if (slash) {
                    token.slash(provider);
                } else {
                    token.payoutStakingReward(provider);
                }
                EntropyProvider(provider).pullTo(router);
                consumed++;
                queue[i].depleted = true;
            }
            i++;
        }
    }
}
