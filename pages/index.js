import * as React from 'react';
import Layout from '../src/Components/Layout';
import { Typography, Grid, Box, Paper } from '@mui/material';
import AuctionCard from '../src/Components/AuctionCard'
import { styled } from '@mui/material/styles';
import Link from '../src/Link';
import factory from '../src/ethereum/factory';
import auction from '../src/ethereum/auction';

class Index extends React.Component {
  static async getInitialProps() {
    const auctionAddresses = await factory.methods.getAuctions().call();

    const auctions = await Promise.all(
      auctionAddresses.map(async (auctionAddress) => {
        let uri = await auction(auctionAddress).methods.tokenURI().call();
        let response = await fetch(uri);
        return await response.json();
      })
    );

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
