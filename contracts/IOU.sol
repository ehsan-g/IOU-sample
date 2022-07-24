// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface InterfaceToken {
    function _safeMint(address to, string memory uri) external returns (bool);
}

// 1- Negar, wants to receive service from Ashkan with her ERC20 tokens.
// 2- Negar negotiates the price and send them to Ashkan and receve service.
// 3- Ashakn can go back to Negar now and burn some tokens anf leave feedbak!.

contract IOU is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    struct MyIOU {
        uint256 _owedAmount;
        uint256 _owedUnits;
        uint256 _startTimer;
        uint256 _dueDate;
        address _debtor;
        address[] _authorizedToDestroy;
    }

    function makeIOU(
        string memory _name,
        string memory _symbol,
        string memory _borrower, //name of emitter
        string memory _lender,
        bytes32 _units //units of deal
    ) public returns (address) {
        InterfaceToken newToken = InterfaceToken(_tokenContract);
        bool tokenId = newToken._safeMint(_needId);

        newContract.setIOU(_name, _symbol, address(store));

        return address(newContract);
    }
}
