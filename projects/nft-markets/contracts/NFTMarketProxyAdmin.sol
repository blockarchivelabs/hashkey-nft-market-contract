// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract NFTMarketProxyAdmin is ProxyAdmin {
    constructor() ProxyAdmin() {}
}
