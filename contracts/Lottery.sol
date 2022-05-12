//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Lottery is Ownable{
     using Address for address payable;

     uint8 winningNumber;
     mapping (address => uint8) public bets;
     bool public betsClosed;
     bool public priceToken;

     function placeBet (uint8 _number) external payable {
          require(bets[msg.sender] ==  0, 'Only 1 bet per player');
          require(msg.value ==  10 ether, 'Bet cost: 10ether');
          require(betsClosed ==  false, 'Bet are closed');
          require(_number > 0 && _number < 255, "Must be a number from 1 to 255");

          bets[msg.sender] = _number;
     }

     function withdrawPrice() external{
          require(betsClosed == true, 'Bet are still open');
          require(priceToken == false, 'Price already taken');
          require(bets[msg.sender] == winningNumber, 'You are not the winner');

          priceToken = true;

          payable(msg.sender).sendValue(address(this).balance);
     }

     function endLottery () external onlyOwner {
          betsClosed = true;

          winningNumber = pseudoRandNumGen();
     }

     function pseudoRandNumGen () private view returns ( uint8 ){
          return uint8(uint256(keccak256(abi.encode(block.timestamp))) % 254 ) + 1;
     }
}