# Decentralised NFT(ERC721) Auction

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Installing](#installing)

## About <a name = "about"></a>

Write about 1-2 paragraphs describing the purpose of your project.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them.

```
Give examples
```

### Installing <a name = "installing"></a>

1. Run `npm install` in your terminal


2. Create a new file in the root dir to store the environment variables called `.env.local`, with the following variables.

```
ENDPOINT = "<infura_node_api_endpoint>"
NEXT_PUBLIC_FACTORY_ADDRESS = "<auction_factory_deployed_address>"
NEXT_PUBLIC_NFT_ADDRESS = "<nft_deployed_address>"
MNEMONIC = "<wallet_mnemonic>
```

3. Run `truffle migrate --network rinkeby`. 
Please note this step requires you to have some <a href="https://faucets.chain.link/rinkeby"> test ETH </a>

4. Copy the contract address of auction factory and nft from the truffle deployment (refer example shown below). Add these values into the .env.local file under `NEXT_PUBLIC_FACTORY_ADDRESS` & `NEXT_PUBLIC_NFT_ADDRESS` respectively 

```
Deploying 'AuctionFactory'
   --------------------------
   > transaction hash:    0xec9a4b66a1027438893bd48237b1e87e0680d4d5c584b7bb59c54a0b717ec0e6
   > Blocks: 2            Seconds: 20
   > contract address:    0xDCa76909121231aa40D604fA9561C76d9B80A6eB <- COPY THIS ADDRESS
   > block number:        9908588
   > block timestamp:     1640923871
   > account:             0x987a97701bb7E87D35B4710F81e425A1DA275680
   > balance:             1.019657642320988035
   > gas used:            2801519 (0x2abf6f)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.02801519 ETH
```
5. Run `npm run dev` to start the Next JS project in development mode