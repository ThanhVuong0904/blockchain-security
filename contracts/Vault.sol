//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable{
     bytes32 private password;

     constructor(bytes32 _password) {
     password = _password;
     }
     modifier checkPassword(bytes32 _password) {
          require(_password == password, "Wrong password");
          _;
     }

     function deposit() external payable onlyOwner{}
     function withDraw(bytes32 _password) external checkPassword(_password) {
          payable(msg.sender).transfer(address(this).balance);
     }
}