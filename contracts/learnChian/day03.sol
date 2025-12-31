// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable {

    event EtherReceived(address indexed sender, uint256 value );

    uint256 public balance = 0;
    mapping (address => uint256) internal depositRecords;
    address[] public depositors;
    address[3] public top3Depositors;

    constructor() Ownable(msg.sender){
        top3Depositors = [address(0), address(0), address(0)];
    }

    receive() external payable {
        _processDeposit();
    }

    function _processDeposit () internal {
        require(msg.value > 0, 'Bank: receive amount is less than 0');

        if(depositRecords[msg.sender] == 0){
            depositors.push(msg.sender);
        }

        depositRecords[msg.sender] += msg.value;
        balance += msg.value;
        sortByAmount(msg.sender);
        emit EtherReceived(msg.sender, msg.value);
    }

    function sortByAmount(address depositor) internal {
        uint256 depositorAmount = depositRecords[depositor];

        // 先移除 depositor（如果存在），后续元素前移
        for(uint256 i = 0; i < 3; i++) {
            if(top3Depositors[i] == depositor) {
                // 将后续元素前移
                for(uint256 j = i; j < 2; j++) {
                    top3Depositors[j] = top3Depositors[j + 1];
                }
                top3Depositors[2] = address(0);
                break;
            }
        }

        // 找到 depositor 应该插入的位置（按金额从大到小）
        for(uint256 i = 0; i < 3; i++) {
            address current = top3Depositors[i];
            if(current == address(0) || depositorAmount > depositRecords[current]) {
                // 插入到位置 i，后续元素后移
                address temp1 = depositor;
                for(uint256 j = i; j < 3; j++) {
                    address temp2 = top3Depositors[j];
                    top3Depositors[j] = temp1;
                    temp1 = temp2;
                }
                break;
            }
        }
    }

    function withdraw() external returns(bool) {
        require(msg.sender == owner(), 'Only owner can apply this function');
        (bool success,) = payable (owner()).call{value: balance}('');
        return success;
    }
}
