// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SettleX} from "../src/SettleX.sol";

contract DeploySettleX is Script {
    function run() public returns (SettleX) {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying SettleX with deployer:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy SettleX contract
        SettleX settleX = new SettleX();

        vm.stopBroadcast();

        console.log("SettleX deployed at:", address(settleX));
        console.log("Owner:", deployer);
        console.log("Owner is authorized:", settleX.isAuthorizedEmployer(deployer));

        return settleX;
    }
}

// SettleX contract: 0x079c4dFC2B330F720A29FDea2cD5C920606b13c8
