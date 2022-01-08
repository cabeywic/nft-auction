import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import web3 from '../ethereum/web3';
import { convertDateTimeToUnixTimestamp } from '../utils/common';
import { Link } from '../routes';

function renderChips(canceled, currentTimestamp, startTimestamp, endTimestamp) {
  if(canceled) return (<Chip label="Cancelled" color="primary" variant="outlined" />);

  if(currentTimestamp < startTimestamp){
    return (<Chip label="Starting soon" color="warning" variant="outlined" />);
  } else if((currentTimestamp > startTimestamp) & (currentTimestamp < endTimestamp)){
    return (<Chip label="Ongoing" color="success" variant="contained" />);
  } else {
    return (<Chip label="Ended" color="primary" variant="outlined" />);
  }
}


export default function AuctionCard(props) {

  const { 
    favourites,
    views,
    title,
    img,
    description,
    tokenId,
    ownerHasDeposited,
    currentTimestamp,
    startTimestamp, 
    endTimestamp,
    highestBindingBid,
    auctionAddress,
    canceled
  } = props.auction;

  return (
    <Card sx={{ maxWidth: 345, background: '#303339' }}>
      <Link route={`/auctions/${auctionAddress}`}>
        <a className="item">
          <CardMedia
            component="img"
            image={img}
          />
        </a>
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            {title}
        </Typography>
        <Typography variant="body2" color="primary.main" sx={{ minHeight: 65 }}>
            {description}
        </Typography>

        <Stack direction="row" spacing={1}>
          {renderChips(canceled, currentTimestamp, startTimestamp, endTimestamp)}
        </Stack>
      </CardContent>
      <CardActions sx={{ borderTop: "1px solid", borderColor: 'secondary.main' }}>
        <Grid container spacing={2}>
            <Grid item xs={7} sx={{ display: "flex", alignItems: "center", marginLeft: 1 }}>
                <Stack spacing={0}>
                    <Typography variant="caption" component="div" sx={{color: "text.secondary"}}>
                        Price
                    </Typography>
                    <Typography variant="body" component="h4" sx={{color: "text.primary"}}>
                        {web3.utils.fromWei(highestBindingBid, "ether")} ETH
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", alignItems: "flex-end" }}>
                <IconButton aria-label="add to favorites" sx={{color: "text.secondary"}} size="small">
                    <FavoriteIcon sx={{ marginRight: 0.3 }}/> {favourites}
                </IconButton>
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", alignItems: "flex-end" }}>
                <IconButton aria-label="add to favorites" sx={{color: "text.secondary"}} size="small">
                <VisibilityIcon sx={{ marginRight: 0.3 }}/> {views}
                </IconButton>
            </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
