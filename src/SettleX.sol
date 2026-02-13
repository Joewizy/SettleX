// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ITIP20} from "tempo-std/interfaces/ITIP20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SettleX
 * @notice Cross-border payroll settlement on Tempo blockchain
 * @dev Leverages Tempo's batch transactions and TIP-20 memos for efficient payroll
 */
contract SettleX is Ownable {
    // ============ Events ============
    
    event EmployerAuthorized(address indexed employer, uint256 timestamp);
    event EmployerRevoked(address indexed employer, uint256 timestamp);
    
    event PaymentExecuted(
        address indexed employer,
        address indexed employee,
        ITIP20 indexed token,
        uint256 amount,
        bytes32 memo,
        uint256 timestamp
    );
    
    event BatchPayrollExecuted(
        address indexed employer,
        bytes32 indexed batchId,
        ITIP20 indexed token,
        uint256 totalAmount,
        uint256 employeeCount,
        uint256 timestamp
    );
    
    // ============ Errors ============
    
    error Unauthorized();
    error InvalidAddress();
    error InvalidAmount();
    error TransferFailed();
    error EmptyBatch();
    
    // ============ State Variables ============
    
    // Authorized employers who can make payments
    mapping(address => bool) public authorizedEmployers;
    
    // Employer => Total amount paid (across all tokens)
    mapping(address => uint256) public totalPaidByEmployer;
    
    // Employer => Number of payments made
    mapping(address => uint256) public paymentCountByEmployer;
    
    // Employer => Token => Total paid in that token
    mapping(address => mapping(ITIP20 => uint256)) public paidByEmployerPerToken;
    
    // Global payment counter
    uint256 public totalPayments;
    
    // ============ Modifiers ============
    
    modifier onlyAuthorizedEmployer() {
        if (!authorizedEmployers[msg.sender] && msg.sender != owner()) {
            revert Unauthorized();
        }
        _;
    }
    
    // ============ Constructor ============
    
    constructor() Ownable(msg.sender) {
        authorizedEmployers[msg.sender] = true;
        emit EmployerAuthorized(msg.sender, block.timestamp);
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Authorize an employer to make payments
     * @param employer Address of the employer to authorize
     */
    function authorizeEmployer(address employer) external onlyOwner {
        if (employer == address(0)) revert InvalidAddress();
        
        authorizedEmployers[employer] = true;
        emit EmployerAuthorized(employer, block.timestamp);
    }
    
    /**
     * @notice Revoke employer authorization
     * @param employer Address of the employer to revoke
     */
    function revokeEmployer(address employer) external onlyOwner {
        authorizedEmployers[employer] = false;
        emit EmployerRevoked(employer, block.timestamp);
    }
    
    // ============ Payment Functions ============
    
    /**
     * @notice Pay a single employee with optional memo
     * @dev For batch payments, call this multiple times using Tempo's native batch transactions
     * @param employee Employee wallet address
     * @param amount Payment amount in token's smallest unit
     * @param token TIP-20 token address
     * @param memo Optional 32-byte memo for reconciliation (invoice ID, payroll ID, etc.)
     */
    function payEmployee(
        address employee,
        uint256 amount,
        ITIP20 token,
        bytes32 memo
    ) external onlyAuthorizedEmployer returns (bool) {
        if (employee == address(0)) revert InvalidAddress();
        if (amount == 0) revert InvalidAmount();
        
        bool success = token.transferFromWithMemo(
            msg.sender,
            employee,
            amount,
            memo
        );
        
        if (!success) revert TransferFailed();
        
        // Update tracking
        totalPaidByEmployer[msg.sender] += amount;
        paymentCountByEmployer[msg.sender]++;
        paidByEmployerPerToken[msg.sender][token] += amount;
        totalPayments++;
        
        // Emit event
        emit PaymentExecuted(
            msg.sender,
            employee,
            token,
            amount,
            memo,
            block.timestamp
        );
        
        return true;
    }
    
    /**
     * @notice Record batch payroll execution
     * @dev This is optional - used to emit a summary event for batch payrolls
     * @param batchId Unique identifier for this batch (e.g., keccak256 of timestamp + employer)
     * @param token Token used for the batch
     * @param totalAmount Total amount paid in the batch
     * @param employeeCount Number of employees paid
     * @dev Called AFTER executing the batch transaction off chain.
     */
    function recordBatchPayroll(
        bytes32 batchId,
        ITIP20 token,
        uint256 totalAmount,
        uint256 employeeCount
    ) external onlyAuthorizedEmployer {
        if (totalAmount == 0) revert InvalidAmount();
        if (employeeCount == 0) revert EmptyBatch();
        
        emit BatchPayrollExecuted(
            msg.sender,
            batchId,
            token,
            totalAmount,
            employeeCount,
            block.timestamp
        );
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Check if an address is an authorized employer
     */
    function isAuthorizedEmployer(address employer) external view returns (bool) {
        return authorizedEmployers[employer] || employer == owner();
    }
    
    /**
     * @notice Get total amount paid by an employer in a specific token
     */
    function getEmployerTokenStats(address employer, ITIP20 token) 
        external 
        view 
        returns (uint256 totalPaid) 
    {
        return paidByEmployerPerToken[employer][token];
    }
    
    /**
     * @notice Get employer payment statistics
     */
    function getEmployerStats(address employer) 
        external 
        view 
        returns (
            uint256 totalPaid,
            uint256 paymentCount,
            bool isAuthorized
        ) 
    {
        return (
            totalPaidByEmployer[employer],
            paymentCountByEmployer[employer],
            authorizedEmployers[employer] || employer == owner()
        );
    }
}