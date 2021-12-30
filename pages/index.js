import * as React from 'react';
import Layout from '../src/Components/Layout';
import { Typography, Grid, Box, Paper } from '@mui/material';
import AuctionCard from '../src/Components/AuctionCard'
import Link from '../src/Link';
import { styled } from '@mui/material/styles';

class Index extends React.Component {
  renderAuctions() {
    return ([1, 2, 3, 4].map(auction => {
      return(
        <Grid item xs={4} key={auction}>
            <AuctionCard />
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
          <Link href="/about" color="secondary">
            Go to the about page
          </Link>
        </Box>
      </Layout>
    );
  }
}

export default Index;
