// packages/hardhat/contracts/NGORegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract NGORegistry is Ownable {
    struct NGO {
        string name;
        string description;
        string website;
        string location;
        string president;
        string ensName;
        string avatar;
        address walletAddress;
        bool isVerified;
        uint256 registrationDate;
    }

    mapping(address => NGO) public ngoByAddress;
    mapping(string => address) public addressByENS;
    address[] public registeredNGOs;

    event NGORegistered(address indexed ngoAddress, string name, string ensName);
    event NGOUpdated(address indexed ngoAddress, string field);
    event NGODeleted(address indexed ngoAddress);

    constructor() Ownable(msg.sender) {}

    function registerNGO(
        string memory _name,
        string memory _description,
        string memory _website,
        string memory _location,
        string memory _president,
        string memory _ensName,
        string memory _avatar
    ) external {
        require(ngoByAddress[msg.sender].walletAddress == address(0), "NGO already registered");

        if (bytes(_ensName).length > 0) {
            require(addressByENS[_ensName] == address(0), "ENS name already taken");
            addressByENS[_ensName] = msg.sender;
        }

        NGO memory newNGO = NGO({
            name: _name,
            description: _description,
            website: _website,
            location: _location,
            president: _president,
            ensName: _ensName,
            avatar: _avatar,
            walletAddress: msg.sender,
            isVerified: false,
            registrationDate: block.timestamp
        });

        ngoByAddress[msg.sender] = newNGO;
        registeredNGOs.push(msg.sender);

        emit NGORegistered(msg.sender, _name, _ensName);
    }

    function updateNGO(
        string memory _name,
        string memory _description,
        string memory _website,
        string memory _location,
        string memory _president,
        string memory _avatar
    ) external {
        require(ngoByAddress[msg.sender].walletAddress != address(0), "NGO not registered");

        ngoByAddress[msg.sender].name = _name;
        ngoByAddress[msg.sender].description = _description;
        ngoByAddress[msg.sender].website = _website;
        ngoByAddress[msg.sender].location = _location;
        ngoByAddress[msg.sender].president = _president;
        ngoByAddress[msg.sender].avatar = _avatar;

        emit NGOUpdated(msg.sender, "NGO details updated");
    }

    function deleteNGO() external {
        require(ngoByAddress[msg.sender].walletAddress != address(0), "NGO not registered");

        // Remove from ENS mapping
        if (bytes(ngoByAddress[msg.sender].ensName).length > 0) {
            delete addressByENS[ngoByAddress[msg.sender].ensName];
        }

        // Remove from arrays and mappings
        delete ngoByAddress[msg.sender];

        // Remove from registered NGOs array
        for (uint i = 0; i < registeredNGOs.length; i++) {
            if (registeredNGOs[i] == msg.sender) {
                registeredNGOs[i] = registeredNGOs[registeredNGOs.length - 1];
                registeredNGOs.pop();
                break;
            }
        }

        emit NGODeleted(msg.sender);
    }

    function getNGOByAddress(address _ngoAddress) external view returns (NGO memory) {
        return ngoByAddress[_ngoAddress];
    }

    function getNGOByENS(string memory _ensName) external view returns (NGO memory) {
        address ngoAddress = addressByENS[_ensName];
        require(ngoAddress != address(0), "ENS name not registered");
        return ngoByAddress[ngoAddress];
    }

    function getAllNGOs() external view returns (NGO[] memory) {
        NGO[] memory ngos = new NGO[](registeredNGOs.length);
        for (uint256 i = 0; i < registeredNGOs.length; i++) {
            ngos[i] = ngoByAddress[registeredNGOs[i]];
        }
        return ngos;
    }
}
