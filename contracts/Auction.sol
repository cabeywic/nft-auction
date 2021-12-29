// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

pragma solidity ^0.8.1;

contract AuctionFactory {
    event AuctionCreated(address indexed auctionContract, address indexed owner, uint numAuctions); 

    address[] public auctions;
    address erc721Contract;

    constructor(address _erc721Contract) {
        erc721Contract = _erc721Contract;
    }

    function getAuctions() public view returns(address[] memory){
        return auctions;
    }

     function createAuction(uint startBlock, uint endBlock, uint bidIncrement, uint tokenId) public {
        Auction newAuction = new Auction(startBlock, endBlock, msg.sender, bidIncrement, erc721Contract, tokenId);
        auctions.push(address(newAuction));

        emit AuctionCreated(address(newAuction), msg.sender, auctions.length);
    }

    function getCurrentBlock() public view returns(uint){
        return block.number;
    }
}

contract Auction is IERC721Receiver, ERC165, ERC721Holder {
    uint public startBlock;
    uint public endBlock;
    address public owner;
    uint public bidIncrement;
    ERC721 public erc721Contract;
    uint public tokenId;

    // state
    bool public canceled;
    address payable public highestBidder;
    mapping(address => uint256) fundsByBidder;
    uint public highestBindingBid;
    bool ownerHasWithdrawn;
    bool ownerHasDeposited;

    event LogBid(address indexed bidder, uint indexed bid, address indexed highestBidder, uint highestBindingBid);
    event LogWithdrawal(address indexed withdrawer, address indexed withdrawalAccount, uint indexed amount);
    event LogCanceled();
    event LogDeposit();
    event LogTransferOut(address indexed transferTo, uint indexed amount);

    constructor(uint _startBlock, uint _endBlock, address _owner, uint _bidIncrement, address _erc721Contract, uint _tokenId) {
        require(_startBlock < _endBlock, "Start block must be less than the end block");
        require(_startBlock > block.number, "Start block  must be greater than the current block");

        startBlock = _startBlock;
        endBlock = _endBlock;
        owner = _owner;
        bidIncrement = _bidIncrement;
        erc721Contract = ERC721(_erc721Contract);
        tokenId = _tokenId;

        require(erc721Contract.ownerOf(tokenId) == owner, "Auction owner must own the NFT token");
    }

    modifier onlyNotOwner {
        require(msg.sender != owner, "Auction contract owner cannot perform this action");
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only auction contract owner can perform this action");
        _;
    }

    modifier onlyAfterStart {
        require(block.number >= startBlock, "Auction has not started");
        _;
    }

    modifier onlyBeforeEnd {
        require(block.number < endBlock, "Auction has ended");
        _;
    }

    modifier onlyNotCanceled  {
        require(!canceled, "Auction has been canceled");
        _;
    }

    modifier onlyEndedOrCanceled {
        require(block.number > endBlock && !canceled, "Auction has not ended or been canceled");
        _;
    }

    modifier onlyDeposited {
        require(ownerHasDeposited, "Owner has not deposited NFT");
        _;
    }

    modifier onlyNotDeposited {
        require(!ownerHasDeposited, "Owner has deposited NFT");
        _;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function deposit() public onlyOwner onlyNotDeposited onlyBeforeEnd onlyNotCanceled {
        // Transfer ownership of NFT to contract
        require(erc721Contract.ownerOf(tokenId) == msg.sender, "Caller must own the NFT token");
        require(erc721Contract.getApproved(tokenId)  == address(this), "Must approve contract as operator");

        erc721Contract.safeTransferFrom(msg.sender, address(this), tokenId);
        ownerHasDeposited = true;
        emit LogDeposit();
    }
    

    function placeBid() public payable onlyNotOwner onlyAfterStart onlyBeforeEnd onlyNotCanceled onlyDeposited{
        require(msg.value > 0, "Bids must be greater than 0");

        uint newBid = fundsByBidder[msg.sender] + msg.value;
        require(newBid > highestBindingBid, "Bids must be above the highest current bid");

        // Increment the senders bid 
        fundsByBidder[msg.sender] += msg.value;

        uint currentHighestBid = fundsByBidder[highestBidder];
        if(currentHighestBid > newBid){
            highestBindingBid = min(newBid + bidIncrement, currentHighestBid);
        } else {
            if (msg.sender != highestBidder) {
                highestBidder = payable(msg.sender);
                highestBindingBid = min(newBid, currentHighestBid + bidIncrement);
            }

            currentHighestBid = newBid;
        }

        emit LogBid(msg.sender, newBid, highestBidder, highestBindingBid);
    }

    function withdraw() public onlyEndedOrCanceled {
        address payable withdrawalAccount;
        uint withdrawalAmount;

        if (canceled) {
            // if the auction was canceled, everyone should simply be allowed to withdraw their funds
            withdrawalAccount = payable(msg.sender);
            withdrawalAmount = fundsByBidder[withdrawalAccount];
        } else {
            if(msg.sender == owner){
                require(!ownerHasWithdrawn, "Owner has already withdrawn");
                withdrawalAccount = highestBidder;
                withdrawalAmount = highestBindingBid;

                address transferTo = highestBidder;
                if(highestBindingBid == 0) transferTo = owner;
                erc721Contract.safeTransferFrom(address(this), transferTo, tokenId);
                ownerHasWithdrawn = true;

                emit LogTransferOut(transferTo, highestBindingBid);
            } else {
                if( msg.sender == highestBidder) require(ownerHasWithdrawn, "Must wait for owner to wthdraw");

                withdrawalAccount = payable(msg.sender);
                withdrawalAmount = fundsByBidder[msg.sender];
            }
        }

        if(msg.sender != owner){
            require(withdrawalAmount > 0, "Withdrawal amount for this address is 0");
            withdrawalAccount.transfer(withdrawalAmount);
            fundsByBidder[withdrawalAccount] -= withdrawalAmount;
        }

        emit LogWithdrawal(msg.sender, withdrawalAccount, withdrawalAmount);
    }

    function cancel() public onlyOwner onlyNotCanceled onlyBeforeEnd {
        canceled = true;
        if(ownerHasDeposited) erc721Contract.safeTransferFrom(address(this), owner, tokenId);

        emit LogCanceled();
    }

    function tokenURI() public view returns (string memory){
        return erc721Contract.tokenURI(tokenId);
    }
}