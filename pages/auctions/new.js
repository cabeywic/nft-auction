import * as React from 'react';
import Layout from '../../src/Components/Layout';
import { Typography, Grid, Box, Skeleton, Divider, CardMedia, Paper, Button, InputBase, Card, SvgIcon } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadingButton from '@mui/lab/LoadingButton';
import factory from '../../src/ethereum/factory';
import nft from '../../src/ethereum/nft';
import web3 from '../../src/ethereum/web3';
import swal from 'sweetalert2';
import { Router } from '../../src/routes';

const Textbox = (props) => {
    return(
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', background: '#303339', height: 100, marginBottom: 1 }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1, height: 100, fontSize: "1.5em" }}
                size="large"
                placeholder={props.placeholder}
                onChange={props.onChange}
                value={props.value}
            />
        </Paper>
    )
}

class AuctionNew extends React.Component {

    state = {
        currentBlock: "",
        startBlock: "50",
        endBlock: "100",
        bidIncrement: "1000000",
        tokenId: "",
        tokenImg: "",
        isRefresh: false,
        isLoading: false
    }
 
    createAuction = async () => {
        const { tokenId, bidIncrement, currentBlock, startBlock, endBlock } = this.state;

        this.setState({ isLoading: true });
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createAuction(
                startBlock, 
                endBlock, 
                web3.utils.toWei(bidIncrement, "ether"), 
                tokenId
            ).send({ from: accounts[0] });

            Router.pushRoute('/');
        } catch(err) {
            swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
        this.setState({ isLoading: false });
    }

    loadImage = async () => {
        const { tokenId } = this.state;

        this.setState({ isRefresh: true });
        try {
            let tokenURI = await nft.methods.tokenURI(tokenId).call();
            let response = await fetch(tokenURI);
            response = await response.json();
            let tokenImg = response.img;
            this.setState({ tokenImg });
        } catch(err) {
            swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
        this.setState({ isRefresh: false });
    }

    renderTokenImage = () => {
        const { tokenImg } = this.state;
        if(!tokenImg) return (
            <Skeleton
                    sx={{ bgcolor: '#303339' }}
                    variant="rectangular"
                    height={500}
            />
        )
        return(
            <Card sx={{ backgroundColor: "#303339", marginBottom: 4 }} raised>
                <CardMedia
                    component="img"
                    image={tokenImg}
                    alt="green iguana"
                />
            </Card>
        )
    }

    render() {
        const { isLoading, isRefresh } = this.state;
        return (
        <Layout maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h6" component="h1" gutterBottom>
                    Create New Auction
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {this.renderTokenImage()}
                    </Grid>
                    <Grid item xs={6}>
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', background: '#303339', height: 100, marginBottom: 1 }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1, height: 100, fontSize: "1.5em" }}
                                size="large"
                                placeholder="Token ID"
                                onChange={event => this.setState({tokenId: event.target.value})}
                            />
                            <Divider sx={{ height: 28, m: 0.5, backgroundColor: "primary.main" }} orientation="vertical" />
                            <LoadingButton 
                             color="primary" 
                             size="large" 
                             variant="contained" 
                             sx={{ mx:2 }} 
                             endIcon={<RefreshIcon />} 
                             onClick={this.loadImage}
                             loading={isRefresh}>
                                Refresh
                            </LoadingButton>
                        </Paper>
                        <Textbox 
                         placeholder="Start Block"
                         onChange={event => this.setState({ startBlock: event.target.value })}
                         value={this.state.startBlock}/>
                        <Textbox 
                         placeholder="End Block"
                         onChange={event => this.setState({ endBlock: event.target.value })}
                         value={this.state.endBlock}/>
                         
                    </Grid>
                    <Grid item xs={12}>
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
                                placeholder="Bid Increment"
                            />
                            <Typography variant="body" component="h3" sx={{ color: "text.primary", mx: 2 }}>
                                ETH
                            </Typography>
                            <Divider sx={{ height: 28, m: 0.5, backgroundColor: "primary.main" }} orientation="vertical" />
                            <LoadingButton 
                             color="primary" 
                             size="large" 
                             variant="contained" 
                             sx={{ mx:2 }} 
                             onClick={this.createAuction}
                             loading={isLoading}>
                                Create
                            </LoadingButton>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
        );
    }
}

export default AuctionNew;
