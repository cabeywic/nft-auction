import * as React from 'react';
import Layout from '../src/Components/Layout';
import { Typography, Grid, Box, Paper } from '@mui/material';
import AuctionCard from '../src/Components/AuctionCard'
import factory from '../src/ethereum/factory';
import auction from '../src/ethereum/auction';

class Index extends React.Component {
  static async getInitialProps() {
    const auctionAddresses = await factory.methods.getAuctions().call();

    let auctionSummary = [];
    let auctions = await Promise.all(
      auctionAddresses.map(async (auctionAddress) => {
        let as = await auction(auctionAddress).methods.getSummary().call();
        const currentTimestamp = as[0];
        const startTimestamp = as[1];
        const endTimestamp = as[2];
        const tokenId = as[3];
        const tokenURI = as[4];
        const erc721Contract = as[5];
        const owner = as[6];
        const highestBidder = as[7];
        const highestBindingBid = as[8];
        const bidIncrement = as[9];
        const canceled = as[10];

        auctionSummary.push({ currentTimestamp, startTimestamp, endTimestamp, tokenId, owner, canceled, highestBindingBid, auctionAddress })

        let response = await fetch(tokenURI);
        return await response.json();
      })
    );

    auctions = auctions.map(function(e, i) {
      return {...e, ...auctionSummary[i]};
    });

    return { auctions };
}

  renderAuctions() {
    return (this.props.auctions.map((auction, index) => {
      return(
        <Grid item xs={4} key={index}>
            <AuctionCard auction={auction}/>
        </Grid>
      )
    }))
  }

  render() {
    return (
      <Layout maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" component="h1" gutterBottom>
            Auctions
          </Typography>
          <Grid container spacing={2}>
            {this.renderAuctions()}
          </Grid>
        </Box>
      </Layout>
    );
  }
}

export default Index;
