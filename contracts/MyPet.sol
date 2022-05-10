//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MyPets {
  string public MyDog;
  address public Owner;

  modifier onlyOwner () {
    require(msg.sender == Owner, "Authorized user only");
    _;
  }
  constructor(string memory _myDog) {
    MyDog = _myDog;
    Owner = msg.sender;
  }

  function changeOwner (address _newOwner) external onlyOwner {
    Owner = _newOwner;
  }
  function updateDog(string memory _myDog) external onlyOwner {
    require(msg.sender == Owner, "Authorized user only");
    MyDog = _myDog;
  }
}