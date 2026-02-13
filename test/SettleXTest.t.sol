// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {ITIP20} from "tempo-std/interfaces/ITIP20.sol";
import {ITIP20RolesAuth} from "tempo-std/interfaces/ITIP20RolesAuth.sol";
import {StdPrecompiles} from "tempo-std/StdPrecompiles.sol";
import {StdTokens} from "tempo-std/StdTokens.sol";
import {SettleX} from "../src/SettleX.sol";

contract SettleXTest is Test {
    ITIP20 public token;
    SettleX public settleX;

    address public constant OWNER = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    address public constant EMPLOYER1 = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
    address public constant EMPLOYER2 = address(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
    address public constant EMPLOYEE1 = address(0x90F79bf6EB2c4f870365E785982E1f101E93b906);
    address public constant EMPLOYEE2 = address(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65);
    address public constant EMPLOYEE3 = address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc);

    bytes32 public constant MEMO_PAYROLL_JAN = bytes32("PAYROLL-2025-01");
    bytes32 public constant MEMO_INVOICE_1 = bytes32("INV-001");
    bytes32 public constant MEMO_INVOICE_2 = bytes32("INV-002");

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

    function setUp() public {
        // Set fee token
        address feeToken = vm.envOr("TEMPO_FEE_TOKEN", StdTokens.ALPHA_USD_ADDRESS);
        StdPrecompiles.TIP_FEE_MANAGER.setUserToken(feeToken);

        // Create test token
        token = ITIP20(
            StdPrecompiles.TIP20_FACTORY.createToken(
                "Test AlphaUSD",
                "tAUSD",
                "USD",
                StdTokens.PATH_USD,
                address(this),
                bytes32(0)
            )
        );

        // Grant issuer role
        ITIP20RolesAuth(address(token)).grantRole(token.ISSUER_ROLE(), address(this));

        // Deploy SettleX
        vm.prank(OWNER);
        settleX = new SettleX();

        // Mint tokens to employers
        token.mint(EMPLOYER1, 10_000_000 * 10 ** token.decimals()); // 10M tokens
        token.mint(EMPLOYER2, 10_000_000 * 10 ** token.decimals());
    }

    // ============ Authorization Tests ============

    function test_OwnerIsAuthorizedByDefault() public {
        assertTrue(settleX.isAuthorizedEmployer(OWNER));
        assertTrue(settleX.authorizedEmployers(OWNER));
    }

    function test_AuthorizeEmployer() public {
        vm.expectEmit(true, false, false, true);
        emit EmployerAuthorized(EMPLOYER1, block.timestamp);

        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        assertTrue(settleX.authorizedEmployers(EMPLOYER1));
        assertTrue(settleX.isAuthorizedEmployer(EMPLOYER1));
    }

    function test_RevokeEmployer() public {
        vm.startPrank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);
        assertTrue(settleX.isAuthorizedEmployer(EMPLOYER1));

        vm.expectEmit(true, false, false, true);
        emit EmployerRevoked(EMPLOYER1, block.timestamp);

        settleX.revokeEmployer(EMPLOYER1);
        vm.stopPrank();

        assertFalse(settleX.authorizedEmployers(EMPLOYER1));
        assertFalse(settleX.isAuthorizedEmployer(EMPLOYER1));
    }

    function test_RevertWhen_NonOwnerTriesToAuthorize() public {
        vm.prank(EMPLOYER1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", EMPLOYER1));
        settleX.authorizeEmployer(EMPLOYER2);
    }

    function test_RevertWhen_AuthorizingZeroAddress() public {
        vm.prank(OWNER);
        vm.expectRevert(SettleX.InvalidAddress.selector);
        settleX.authorizeEmployer(address(0));
    }

    // ============ Single Payment Tests ============

    function test_PayEmployee() public {
        // Authorize employer
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        uint256 amount = 5_000 * 10 ** token.decimals(); // 5,000 tokens

        // Approve contract to spend
        vm.prank(EMPLOYER1);
        token.approve(address(settleX), amount);

        // Expect event
        vm.expectEmit(true, true, true, true);
        emit PaymentExecuted(EMPLOYER1, EMPLOYEE1, token, amount, MEMO_INVOICE_1, block.timestamp);

        // Execute payment
        vm.prank(EMPLOYER1);
        bool success = settleX.payEmployee(EMPLOYEE1, amount, token, MEMO_INVOICE_1);

        assertTrue(success);
        assertEq(token.balanceOf(EMPLOYEE1), amount);
        assertEq(settleX.totalPaidByEmployer(EMPLOYER1), amount);
        assertEq(settleX.paymentCountByEmployer(EMPLOYER1), 1);
        assertEq(settleX.totalPayments(), 1);
    }

    function test_PayEmployeeWithoutMemo() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        uint256 amount = 1_000 * 10 ** token.decimals();

        vm.startPrank(EMPLOYER1);
        token.approve(address(settleX), amount);
        
        bool success = settleX.payEmployee(EMPLOYEE1, amount, token, bytes32(0));
        vm.stopPrank();

        assertTrue(success);
        assertEq(token.balanceOf(EMPLOYEE1), amount);
    }

    function test_MultiplePaymentTracking() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        uint256 amount1 = 5_000 * 10 ** token.decimals();
        uint256 amount2 = 3_000 * 10 ** token.decimals();
        uint256 amount3 = 2_000 * 10 ** token.decimals();

        vm.startPrank(EMPLOYER1);
        token.approve(address(settleX), amount1 + amount2 + amount3);

        settleX.payEmployee(EMPLOYEE1, amount1, token, MEMO_INVOICE_1);
        settleX.payEmployee(EMPLOYEE2, amount2, token, MEMO_INVOICE_2);
        settleX.payEmployee(EMPLOYEE3, amount3, token, MEMO_PAYROLL_JAN);
        vm.stopPrank();

        assertEq(settleX.totalPaidByEmployer(EMPLOYER1), amount1 + amount2 + amount3);
        assertEq(settleX.paymentCountByEmployer(EMPLOYER1), 3);
        assertEq(settleX.paidByEmployerPerToken(EMPLOYER1, token), amount1 + amount2 + amount3);
        assertEq(settleX.totalPayments(), 3);
    }

    function test_RevertWhen_UnauthorizedEmployerTriesToPay() public {
        uint256 amount = 1_000 * 10 ** token.decimals();

        vm.prank(EMPLOYER2); // Not authorized
        vm.expectRevert(SettleX.Unauthorized.selector);
        settleX.payEmployee(EMPLOYEE1, amount, token, MEMO_INVOICE_1);
    }

    function test_RevertWhen_PayingZeroAddress() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        vm.prank(EMPLOYER1);
        vm.expectRevert(SettleX.InvalidAddress.selector);
        settleX.payEmployee(address(0), 1_000 * 10 ** token.decimals(), token, MEMO_INVOICE_1);
    }

    function test_RevertWhen_PayingZeroAmount() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        vm.prank(EMPLOYER1);
        vm.expectRevert(SettleX.InvalidAmount.selector);
        settleX.payEmployee(EMPLOYEE1, 0, token, MEMO_INVOICE_1);
    }

    function test_RevertWhen_InsufficientAllowance() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        uint256 amount = 5_000 * 10 ** token.decimals();

        // Don't approve enough
        vm.prank(EMPLOYER1);
        token.approve(address(settleX), amount / 2);

        vm.prank(EMPLOYER1);
        vm.expectRevert(); // Will revert from token contract
        settleX.payEmployee(EMPLOYEE1, amount, token, MEMO_INVOICE_1);
    }

    // ============ Batch Payroll Recording Tests ============

    function test_RecordBatchPayroll() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        bytes32 batchId = keccak256(abi.encodePacked(EMPLOYER1, block.timestamp));
        uint256 totalAmount = 10_000 * 10 ** token.decimals();
        uint256 employeeCount = 3;

        vm.expectEmit(true, true, true, true);
        emit BatchPayrollExecuted(EMPLOYER1, batchId, token, totalAmount, employeeCount, block.timestamp);

        vm.prank(EMPLOYER1);
        settleX.recordBatchPayroll(batchId, token, totalAmount, employeeCount);
    }

    function test_RevertWhen_RecordingBatchWithZeroAmount() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        bytes32 batchId = keccak256(abi.encodePacked(EMPLOYER1, block.timestamp));

        vm.prank(EMPLOYER1);
        vm.expectRevert(SettleX.InvalidAmount.selector);
        settleX.recordBatchPayroll(batchId, token, 0, 3);
    }

    function test_RevertWhen_RecordingBatchWithZeroEmployees() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        bytes32 batchId = keccak256(abi.encodePacked(EMPLOYER1, block.timestamp));

        vm.prank(EMPLOYER1);
        vm.expectRevert(SettleX.EmptyBatch.selector);
        settleX.recordBatchPayroll(batchId, token, 1000, 0);
    }

    // ============ View Function Tests ============

    function test_GetEmployerStats() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        uint256 amount1 = 5_000 * 10 ** token.decimals();
        uint256 amount2 = 3_000 * 10 ** token.decimals();

        vm.startPrank(EMPLOYER1);
        token.approve(address(settleX), amount1 + amount2);
        settleX.payEmployee(EMPLOYEE1, amount1, token, MEMO_INVOICE_1);
        settleX.payEmployee(EMPLOYEE2, amount2, token, MEMO_INVOICE_2);
        vm.stopPrank();

        (uint256 totalPaid, uint256 paymentCount, bool isAuthorized) = settleX.getEmployerStats(EMPLOYER1);

        assertEq(totalPaid, amount1 + amount2);
        assertEq(paymentCount, 2);
        assertTrue(isAuthorized);
    }

    function test_GetEmployerTokenStats() public {
        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        uint256 amount = 10_000 * 10 ** token.decimals();

        vm.startPrank(EMPLOYER1);
        token.approve(address(settleX), amount);
        settleX.payEmployee(EMPLOYEE1, amount, token, MEMO_INVOICE_1);
        vm.stopPrank();

        uint256 totalPaid = settleX.getEmployerTokenStats(EMPLOYER1, token);
        assertEq(totalPaid, amount);
    }

    // ============ Fuzz Tests ============

    function testFuzz_PayEmployee(uint128 amount, bytes32 memo) public {
        // Bound amount to reasonable range
        amount = uint128(bound(amount, 1, 1_000_000 * 10 ** token.decimals()));

        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        vm.startPrank(EMPLOYER1);
        token.approve(address(settleX), amount);
        bool success = settleX.payEmployee(EMPLOYEE1, amount, token, memo);
        vm.stopPrank();

        assertTrue(success);
        assertEq(token.balanceOf(EMPLOYEE1), amount);
        assertEq(settleX.totalPaidByEmployer(EMPLOYER1), amount);
        assertEq(settleX.paymentCountByEmployer(EMPLOYER1), 1);
    }

    function testFuzz_MultiplePayments(
        uint128 amount1,
        uint128 amount2,
        uint128 amount3,
        bytes32 memo1,
        bytes32 memo2,
        bytes32 memo3
    ) public {
        // Bound amounts
        amount1 = uint128(bound(amount1, 1, 100_000 * 10 ** token.decimals()));
        amount2 = uint128(bound(amount2, 1, 100_000 * 10 ** token.decimals()));
        amount3 = uint128(bound(amount3, 1, 100_000 * 10 ** token.decimals()));

        uint256 totalAmount = uint256(amount1) + uint256(amount2) + uint256(amount3);

        vm.prank(OWNER);
        settleX.authorizeEmployer(EMPLOYER1);

        vm.startPrank(EMPLOYER1);
        token.approve(address(settleX), totalAmount);

        settleX.payEmployee(EMPLOYEE1, amount1, token, memo1);
        settleX.payEmployee(EMPLOYEE2, amount2, token, memo2);
        settleX.payEmployee(EMPLOYEE3, amount3, token, memo3);
        vm.stopPrank();

        assertEq(token.balanceOf(EMPLOYEE1), amount1);
        assertEq(token.balanceOf(EMPLOYEE2), amount2);
        assertEq(token.balanceOf(EMPLOYEE3), amount3);
        assertEq(settleX.totalPaidByEmployer(EMPLOYER1), totalAmount);
        assertEq(settleX.paymentCountByEmployer(EMPLOYER1), 3);
    }

    function testFuzz_AuthorizeAndRevoke(address employer) public {
        vm.assume(employer != address(0));
        vm.assume(employer != OWNER);

        vm.startPrank(OWNER);
        
        settleX.authorizeEmployer(employer);
        assertTrue(settleX.isAuthorizedEmployer(employer));

        settleX.revokeEmployer(employer);
        assertFalse(settleX.isAuthorizedEmployer(employer));
        
        vm.stopPrank();
    }
}