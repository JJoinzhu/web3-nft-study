// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "./day03.sol";

contract BigBank is Bank {
    uint256 public MIN_DEPOSIT_VALUE = 0.001 ether;

    modifier check_min (){
        require(msg.value >= MIN_DEPOSIT_VALUE, 'Deposit must be more than MIN_DEPOSIT_VALUE');
        _;
    }

    receive() external payable override check_min{
        _processDeposit();
    }
}

contract Admin is Ownable {
    BigBank public bigBank;

    event WithdrawExecuted(address indexed bigBank, uint256 amount);

    constructor () Ownable(msg.sender){}

    function setBigBank (address _bank) external onlyOwner {
        require(_bank != address(0), 'Admin: invalid address');
        bigBank = BigBank(payable(_bank));
    }

    function withdrawFromBigBank() external onlyOwner returns (bool) {
        require(address(bigBank) != address(0), "Admin: BigBank not set");

        uint256 balanceBefore = address(this).balance;
        bool flag =  bigBank.withdraw();
        uint256 amount = address(this).balance - balanceBefore;
        emit WithdrawExecuted(address(bigBank), amount);

        return flag;
    }
}
