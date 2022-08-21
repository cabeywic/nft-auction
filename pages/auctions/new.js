import * as React from 'react';
import Layout from '../../src/Components/Layout';
import { Typography, Grid, Box, Skeleton, Divider, CardMedia, Paper, Stack, InputBase, Card, SvgIcon } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import factory from '../../src/ethereum/factory';
import nft from '../../src/ethereum/nft';
import web3 from '../../src/ethereum/web3';
import swal from 'sweetalert2';
import { Router } from '../../src/routes';

class AuctionNew extends React.Component {

    state = {
        currentBlock: "",
        startDateTime: new Date(),
        endDateTime: new Date(),
        bidIncrement: "1000000",
        tokenId: "",
        tokenImg: "",
        isRefresh: false,
        isLoading: false,
        isAuthorising: false,
        transferAuth: false
    }

    convertDateTimeToUnixTimestamp = (dateObj) => {
        return parseInt((dateObj.getTime() / 1000).toFixed(0))
    }
 
    createAuction = async () => {
        const { tokenId, bidIncrement, startDateTime, endDateTime } = this.state;
        console.log(tokenId, bidIncrement, startDateTime, endDateTime);

        let startTimestamp =  this.convertDateTimeToUnixTimestamp(startDateTime);
        let endTimestamp = this.convertDateTimeToUnixTimestamp(endDateTime);
        console.log(startTimestamp, endTimestamp);

        this.setState({ isLoading: true });
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createAuction(
                startTimestamp, 
                endTimestamp, 
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

    authorizeTransfer = async () => {
        const { tokenId } = this.state;

        this.setState({ isAuthorising: true });
        try {
            const accounts = await web3.eth.getAccounts();
            await nft.methods
             .approve(factory._address, tokenId)
             .send({ from: accounts[0] });
        } catch(err) {
            swal.fire({
                title: 'Error!',
                text: err.message,
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
        this.setState({ isAuthorising: false });
    }

    loadImage = async () => {
        const { tokenId } = this.state;

        this.setState({ isRefresh: true });
        try {
            let transferAuth = false;
            let tokenURI = await nft.methods.tokenURI(tokenId).call();
            let response = await fetch(tokenURI);
            response = await response.json();
            let tokenImg = response.img;

            let approvedAddress = await nft.methods.getApproved(tokenId).call();
            if(approvedAddress == factory._address) transferAuth = true;

            this.setState({ tokenImg, transferAuth });
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
        const { isLoading, isRefresh, transferAuth, isAuthorising, startDateTime, endDateTime } = this.state;
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
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', background: '#303339', height: 100, marginBottom: 5 }}
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
                            <Divider sx={{ height: 28, m: 0.5, backgroundColor: "primary.main" }} orientation="vertical" />
                            <LoadingButton 
                             color={transferAuth ? "success" : "warning"}
                             size="large" 
                             variant="contained" 
                             sx={{ mx:2 }} 
                             endIcon={<LockOpenIcon />} 
                             onClick={this.authorizeTransfer}
                             loading={isAuthorising}>
                                Authorize
                            </LoadingButton>
                        </Paper>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Start Date"
                                    value={startDateTime}
                                    onChange={(newDate)=> this.setState({startDateTime: newDate})}
                                    minDate={new Date()}
                                />
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="End Date"
                                    value={endDateTime}
                                    onChange={(newDate)=> this.setState({endDateTime: newDate})}
                                    minDate={startDateTime}
                                />
                            </Stack>
                        </LocalizationProvider>
                         
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
