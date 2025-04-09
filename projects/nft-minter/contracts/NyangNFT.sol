// Contract based on https://docs.openzeppelin.com/contracts/4.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract NyangNFT is ERC721URIStorage, Ownable, ERC2981, IERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public MINT_PRICE;

    // define error event
    event MintError(address user, string message);
    event PriceError(uint256 sent, uint256 required, string message);

    // define common error event
    event Error(string message);

    error InsufficientPayment(uint256 sent, uint256 required);
    error InvalidRecipientAddress(address addr);

    string _customBaseURI;
    uint96 private constant DEFAULT_ROYALTY_FEE = 300; // 3% royalty fee

    // 소유자별 토큰 ID 매핑
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
    // 토큰 ID별 소유자의 토큰 인덱스 매핑
    mapping(uint256 => uint256) private _ownedTokensIndex;
    // 소유자별 토큰 수량
    mapping(address => uint256) private _balances;

    constructor() ERC721("NyangNFT", "NNFT") {
        MINT_PRICE = 0.001 ether;
        _customBaseURI = "https://champs-metadata.onjoyride.com/tc-genesis/tokens_v2/revealed/";
        _setDefaultRoyalty(msg.sender, DEFAULT_ROYALTY_FEE);
    }

    //override _baseURI
    function _baseURI() internal view override returns (string memory) {
        return _customBaseURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _customBaseURI = newBaseURI;
    }

    function getMintPrice() public view returns (uint256) {
        return MINT_PRICE;
    }

    function setMintPrice(uint256 newPrice) public onlyOwner {
        MINT_PRICE = newPrice;
    }

    function mintNFT(address recipient, string memory tokenURI) public payable returns (uint256) {
        if (msg.value < MINT_PRICE) {
            emit PriceError(msg.value, MINT_PRICE, "Insufficient payment for minting");
            revert InsufficientPayment(msg.value, MINT_PRICE);
        }

        if (!_isValidAddress(recipient)) {
            emit MintError(recipient, "Invalid recipient address");
            revert InvalidRecipientAddress(recipient);
        }

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function _isValidAddress(address addr) internal view returns (bool) {
        // Check if address is not zero address
        if (addr == address(0)) {
            return false;
        }

        // Check if address is not a contract
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        if (size > 0) {
            return false;
        }

        // Check if address is within valid range
        if (uint160(addr) > type(uint160).max) {
            return false;
        }

        return true;
    }

    // 쌓인 ETH를 권한이 있는 유저에게 반환
    function collectEther() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // owner 권한 확인
    function isOwner() public view returns (bool) {
        return msg.sender == owner();
    }

    // owner 권한 변경
    function transferOwnership(address newOwner) public override onlyOwner {
        _transferOwnership(newOwner);
    }

    // Set royalty info for a specific token
    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    // Set default royalty for all tokens
    function setDefaultRoyalty(address receiver, uint96 feeNumerator) public onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // Delete default royalty
    function deleteDefaultRoyalty() public onlyOwner {
        _deleteDefaultRoyalty();
    }

    // Override supportsInterface to support both ERC721 and ERC2981
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721URIStorage, ERC2981, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    // Implement required IERC721Enumerable functions
    function tokenOfOwnerByIndex(address owner, uint256 index) public view override returns (uint256) {
        require(index < balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    function tokenByIndex(uint256 index) public view override returns (uint256) {
        require(index < totalSupply(), "Index out of bounds");
        return index + 1; // Since we're using sequential IDs
    }

    // _mint 함수에서 토큰 추적을 위한 추가 로직
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // 민팅 (새 토큰 생성)
        if (from == address(0)) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
        // 전송
        else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];
            _ownedTokens[from][tokenIndex] = lastTokenId;
            _ownedTokensIndex[lastTokenId] = tokenIndex;
        }

        delete _ownedTokens[from][lastTokenIndex];
        delete _ownedTokensIndex[tokenId];
    }
}
