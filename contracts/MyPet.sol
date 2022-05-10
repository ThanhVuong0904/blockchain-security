//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyPets is Ownable{
  string public MyDog;

  constructor(string memory _myDog) {
    MyDog = _myDog;
  }

  function updateDog(string memory _myDog) external onlyOwner {
    MyDog = _myDog;
  }
}