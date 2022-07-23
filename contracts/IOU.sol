// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Proxiable.sol";

contract IOU is Proxiable {
    address _owner;
    address _operator;
    uint256 _price;

    function constructor1() public {
        require(_owner == address(0), "You can't initialize again");
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only owner is allowed!");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == _operator, "Only operator is allowed!");
        _;
    }

    function operator() public view returns (address) {
        return _operator;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function setOperator(address newOperator) public onlyOwner {
        _operator = newOperator;
    }

    function updateCode(address newCode) public onlyOwner {
        updateCodeAddress(newCode);
    }
}
