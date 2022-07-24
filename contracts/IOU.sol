// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface InterfaceToken {
    function _safeMint(address to, string memory uri)
        external
        returns (uint256);
}

// 1- Negar, wants to receive service from Ashkan with her ERC20 tokens.
// 2- Negar negotiates the price and send them to Ashkan and receve service.
// 3- Ashakn can go back to Negar now and burn some tokens anf leave feedbak!.

contract IOU is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    struct Bond {
        uint256 _startTimer;
        uint256 _dueDate;
        address _borrower;
        address _lender;
        uint256 _owedAmount;
        address _tokenContract;
        address[] _authorizedToDestroy;
    }

    mapping(uint256 => address[]) public authurizedByToken;
    mapping(address => Bond) public bondByAddress;

    function makeBond(
        uint256 _dueDate,
        address _borrower, //name of emitter
        address _lender,
        uint256 _owedAmount, //units of deal
        address _tokenContract
    ) public returns (uint256) {
        InterfaceToken newToken = InterfaceToken(_tokenContract);
        uint256 tokenId = newToken._safeMint(_msgSender(), "tokenURI");
        address[] storage _authorized = authurizedByToken[tokenId];
        _authorized.push(_lender);

        bondByAddress[_msgSender()] = Bond(
            block.timestamp,
            _dueDate, // from front-end
            _borrower,
            _lender,
            _owedAmount,
            _tokenContract,
            _authorized
        );

        return tokenId;
    }

    function authorizeNewDetroyer(uint256 tokenId, address newAddress) public {
        Bond storage b = bondByAddress[_msgSender()];
        require(block.timestamp > b._dueDate, "Bond is Expired!");
        b._authorizedToDestroy.push(newAddress);
    }

    function owing() public view returns (uint256) {
        Bond storage b = bondByAddress[_msgSender()];
        require(b._borrower == _msgSender());
        return b._owedAmount;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
