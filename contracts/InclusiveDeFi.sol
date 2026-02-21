// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InclusiveDeFi {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public loans;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event LoanIssued(address indexed user, uint256 amount);

    // 1. P2P Transfer (Write Operation)
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    // 2. Micro-Loan (Write Operation)
    function applyForLoan() public {
        require(loans[msg.sender] == 0, "Existing loan active");
        uint256 loanAmount = 0.01 ether; // Fixed small loan for demo
        loans[msg.sender] = loanAmount;
        balances[msg.sender] += loanAmount;
        emit LoanIssued(msg.sender, loanAmount);
    }

    // 3. Balance Check (Read Operation)
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    // For testing: Deposit funds
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
}