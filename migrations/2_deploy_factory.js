var AuctionFactory = artifacts.require("AuctionFactory");
var NFT = artifacts.require("NFT");

// * First deploy the NFT contract and pass the address as a parameter to auction factory
module.exports = (deployer) => {
  deployer.deploy(NFT).then(function() {
    return deployer.deploy(AuctionFactory, NFT.address)
  });
};