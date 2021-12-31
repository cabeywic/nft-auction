import * as React from 'react';
import Layout from '../../src/Components/Layout';
import { Typography, Grid, Box, Card, CardMedia, CardContent, Divider, Stack, Paper, Button, InputBase, IconButton, SvgIcon } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AuctionBidTable from '../../src/Components/AuctionBidTable';
import auction from '../../src/ethereum/auction';

class AuctionInfo extends React.Component {
    static async getInitialProps(props) {
        let as = await auction(props.query.address).methods.getSummary().call();
        const currentBlock = as[0];
        const startBlock = as[1];
        const endBlock = as[2];
        const tokenId = as[3];
        const tokenURI = as[4];
        const erc721Contract = as[5];
        const ownerHasDeposited = as[6];
        const owner = as[7];
        const highestBidder = as[8];
        const highestBindingBid = as[9];
        const bidIncrement = as[10];
        const canceled = as[11];

        let response = await fetch(tokenURI);
        let metadata = await response.json();

        let auctionInfo = { ...metadata, currentBlock, startBlock, endBlock, tokenId, ownerHasDeposited, owner, canceled, highestBindingBid }
        return { auctionInfo }
    }

  render() {
    const price = 0.01;

    const { 
        favourites,
        views,
        title,
        img,
        description,
        tokenId,
        ownerHasDeposited,
        currentBlock,
        startBlock, 
        endBlock
      } = this.props.auctionInfo;
    
    return (
      <Layout maxWidth="sm">
        <Box sx={{ my: 4 }}>
        <Grid container spacing={2}>
            <Grid item xs={4} >
                <Card sx={{ backgroundColor: "#303339", marginBottom: 4 }}>
                    <CardMedia
                        component="img"
                        image={img}
                        alt="green iguana"
                    />
                </Card>

                <Card sx={{ backgroundColor: "#303339"}}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            Description
                        </Typography>
                        <Divider sx={{ backgroundColor: "primary.main", marginBottom: 2, marginTop: 1 }}/>
                        <Typography variant="body" component="div" sx={{color: "text.secondary"}}>
                            {description}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8} >
                <Typography variant="h4" component="h4" gutterBottom>
                   {title}
                </Typography>
                <Stack spacing={2} direction="row" sx={{color: "text.secondary"}}>
                    <FavoriteIcon sx={{ marginRight: 0.3 }}/> {favourites}
                    <VisibilityIcon sx={{ marginRight: 0.3 }}/> {views}
                </Stack>
                <Card sx={{ backgroundColor: "#303339", my:2}}>
                    <CardContent sx={{color: "text.secondary"}}>
                        <Typography variant="body" component="div">
                            Sale ends June 18, 2022 at 11:12pm +0530 
                        </Typography>
                        <Divider sx={{  marginBottom: 2, marginTop: 1, backgroundColor: "primary.main" }}/>
                        <Stack spacing={0}>
                            <Typography variant="body" component="h4" sx={{color: "text.secondary"}}>
                                Current price
                            </Typography>
                            <Typography variant="body" component="h1" sx={{color: "text.primary"}}>
                                {price} ETH
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', background: '#303339', height: 100 }}
                >
                    <SvgIcon viewBox="0 0 33 53" sx={{ filter: "brightness(3)" }}>
                        <path d="M16.3576 0.666687L16.0095 1.85009V36.1896L16.3576 36.5371L32.2976 27.115L16.3576 0.666687Z" fill="#343434"/>
                        <path d="M16.3578 0.666687L0.417816 27.115L16.3578 36.5372V19.8699V0.666687Z" fill="#8C8C8C"/>
                        <path d="M16.3575 39.5552L16.1613 39.7944V52.0268L16.3575 52.6L32.307 30.1378L16.3575 39.5552Z" fill="#3C3C3B"/>
                        <path d="M16.3578 52.5998V39.5551L0.417816 30.1377L16.3578 52.5998Z" fill="#8C8C8C"/>
                        <path d="M16.3575 36.537L32.2973 27.1151L16.3575 19.8699V36.537Z" fill="#141414"/>
                        <path d="M0.417816 27.1151L16.3576 36.537V19.8699L0.417816 27.1151Z" fill="#393939"/>
                    </SvgIcon>
                    <InputBase
                        sx={{ ml: 1, flex: 1, height: 100, fontSize: "1.5em" }}
                        size="large"
                        placeholder="Place a bid"
                    />
                    <Typography variant="body" component="h3" sx={{ color: "text.primary", mx: 2 }}>
                        ETH
                    </Typography>
                    <Divider sx={{ height: 28, m: 0.5, backgroundColor: "primary.main" }} orientation="vertical" />
                    <Button color="primary" size="large" variant="contained" sx={{ mx:2 }}>
                        Make Offer
                    </Button>
                </Paper>

                <AuctionBidTable />
            </Grid>
          </Grid>
        </Box>
      </Layout>
    );
  }
}

export default AuctionInfo;
