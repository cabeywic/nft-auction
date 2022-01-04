const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
// const options = { gasLimit: 80000000 };
const web3 = new Web3(ganache.provider());
const Auction = require('../build/contracts/Auction.json');
const AuctionFactory = require('../build/contracts/AuctionFactory.json');
const NFT = require('../build/contracts/NFT.json');

let accounts, auction, auctionFactory, auctionContractAddress;
let nft, tokenId;
let startTimestamp, endTimestamp;

const BID_INCREMENT = 1000;

const delay = ms => new Promise(res => setTimeout(res, ms));
const getCurrentTimestamp = () => new Date().getTime()/1000;

const depositERC721Contract = async() => {
    await nft.methods.approve(auctionContractAddress, tokenId).send({ from: accounts[1] });
    await auction.methods.deposit().send({ from: accounts[1], gas: '3000000' });
}

const startAuction = async() => {
    let diff = startTimestamp - getCurrentTimestamp();
    if(diff < 0) return;
    await delay(diff * 1000);
}

const endAuction = async() => {
    let diff = endTimestamp - getCurrentTimestamp();
    if(diff < 0) return;
    // * Additional 1s to make sure auction has ended (note on test timeout)
    await delay(diff * 1000 + 1000);
}

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();

    // Deploy NFT contract
    nft = await new web3.eth.Contract(NFT.abi)
    .deploy({ data: NFT.bytecode })
    .send({ gas: '3000000', from: accounts[0] });

    // Mint an NFT and transfer NFT to account1
    await nft.methods.safeMint(accounts[1]).send({ gas: '2000000', from: accounts[0] });
    tokenId = await nft.methods.getCurrentToken().call();
    tokenId -= 1;

    // Create an auction factory contract
    auctionFactory = await new web3.eth.Contract(AuctionFactory.abi)
     .deploy({ data: AuctionFactory.bytecode, arguments: [nft._address] })
     .send({ gas: '3000000', from: accounts[0] });

    // Set the auction start and end time using the current unix time
    let currentTimestamp = Math.ceil(getCurrentTimestamp());
    startTimestamp = currentTimestamp + 1;
    endTimestamp = startTimestamp + 2;

    // Create an auction contract with account1 as owner
    await auctionFactory.methods.createAuction(startTimestamp, endTimestamp, BID_INCREMENT, tokenId)
     .send({ from: accounts[1], gas: '3000000' });

    let auctions = await auctionFactory.methods.getAuctions().call();
    auctionContractAddress = auctions[0];

    auction = await new web3.eth.Contract(Auction.abi, auctionContractAddress);

    await nft.methods.approve(auctionContractAddress, tokenId).send({ from: accounts[1] });
})

describe('Auction Contract', () => {
    it('deploys the auction factory and auction contract', () => {
        assert.ok(auctionFactory.options.address);
        assert.ok(auction.options.address);
    }) ;

    it('marks the caller as the owner', async() => {
        let owner = await auction.methods.owner().call();
        assert.equal(owner, accounts[1]);
    });

    it('checks if auction owner owns the ERC721 token', async() => {
        let currentTokenOwner = await nft.methods.ownerOf(tokenId).call();
        assert.equal(currentTokenOwner, accounts[1]);
    });

    it('transfers token to contract after owner deposits', async() => {
        await depositERC721Contract();

        let currentTokenOwner = await nft.methods.ownerOf(tokenId).call();
        assert.equal(currentTokenOwner, auctionContractAddress);
    });

    it('allows owner to cancel auction', async() => {
        await auction.methods.cancel().send({ from: accounts[1], gas: '3000000' });
        let isCancelled = await auction.methods.canceled().call();

        assert(isCancelled);
    })

    it('transfers token to owner if deposited on cancellation', async() => {
        await depositERC721Contract();

        await auction.methods.cancel().send({ from: accounts[1], gas: '3000000' });
        let currentTokenOwner = await nft.methods.ownerOf(tokenId).call();
        assert.equal(currentTokenOwner, accounts[1]);
    })

    it('returns valid token URI', async() => {
        await depositERC721Contract();

        let tokenURI = await auction.methods.tokenURI().call();
        assert(tokenURI.includes("http://"))
    })

    it('allows users to place bids after auction start', async() => {
        await depositERC721Contract();
        await startAuction();

        await auction.methods.placeBid().send({ from: accounts[2], gas: '3000000', value: '5000' });
        let highestBidder = await auction.methods.highestBidder().call();

        assert.equal(highestBidder, accounts[2]);
    }).timeout(5000);

    it('places bids in increments', async() => {
        await depositERC721Contract();
        await startAuction();

        await auction.methods.placeBid().send({ from: accounts[2], gas: '3000000', value: '5000' });
        let highestBindingBid = await auction.methods.highestBindingBid().call();

        assert.equal(highestBindingBid, BID_INCREMENT);
    }).timeout(5000);

    it('only allows bids greater than 0', async() => {
        await depositERC721Contract();
        await startAuction();

        try {
            await auction.methods.placeBid().send({ from: accounts[2], gas: '3000000', value: '0' });
            assert(false);
        } catch(err) {
            assert(true);
        }
    }).timeout(5000);

    it('selects highest binding bid in increments', async() => {
        await depositERC721Contract();
        await startAuction();

        await auction.methods.placeBid().send({ from: accounts[2], gas: '3000000', value: '5000' });
        await auction.methods.placeBid().send({ from: accounts[3], gas: '3000000', value: '10000' });
        
        let highestBidder = await auction.methods.highestBidder().call();
        let highestBindingBid = await auction.methods.highestBindingBid().call();

        assert.equal(highestBidder, accounts[3]);
        assert.equal(highestBindingBid, '6000');
    }).timeout(5000);

    it('prevents users from bidding after auction ends', async() => {
        await depositERC721Contract();
        await endAuction();

        try {
            await auction.methods.placeBid().send({ from: accounts[2], gas: '3000000', value: '5000' });
            assert(false);
        } catch(err) {
            assert(true);
        }
    }).timeout(10000);

    it('prevents owner from cancelling after auction starts', async() => {
        await depositERC721Contract();
        await startAuction();

        try {
            await auction.methods.cancel().send({ from: accounts[1] , gas: '3000000'});
            assert(false);
        } catch(err) {
            assert(true);
        }
    }).timeout(10000);

    it('transfers token back to owner if no bids are placed', async() => {
        await depositERC721Contract();
        await endAuction();

        await auction.methods.withdraw().send({ from: accounts[1] , gas: '3000000'});
        let currentTokenOwner = await nft.methods.ownerOf(tokenId).call();
        assert.equal(currentTokenOwner, accounts[1]);
    }).timeout(10000);

    it('transfers token to highest bidder', async() => {
        await depositERC721Contract();
        await startAuction();
        await auction.methods.placeBid().send({ from: accounts[2], gas: '3000000', value: '5000'});
        await endAuction();

        await auction.methods.withdraw().send({ from: accounts[1] , gas: '3000000' });
        let currentTokenOwner = await nft.methods.ownerOf(tokenId).call();
        assert.equal(currentTokenOwner, accounts[2]);
    }).timeout(10000);
})