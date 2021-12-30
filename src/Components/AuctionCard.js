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


export default function AuctionCard() {
    const price = 0.01;
    const favourites = 16;
    const views = 142;
    const title = 'Neon Kabuki Warrior - Bat';
    const imageUrl = "https://lh3.googleusercontent.com/Sv5pi_Isdu9e9iLscuHSuvz5jYVQD_7XHChUkg8rtsbPsPCfYP5KapCZTBmMvbn0xa16LQbFyitKonm3-1MB2xWDAyZrFZrlwH7_mA=w600";
    const description = `1 out of 5 pieces from the Neon Kabuki Warrior Set

    Based on the work of Utagawa Kuniyoshi`;

  return (
    <Card sx={{ maxWidth: 345, background: '#303339' }}>
      <CardMedia
        component="img"
        image={imageUrl}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            {title}
        </Typography>
        <Typography variant="body2" color="primary.main">
            {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ borderTop: "1px solid", borderColor: 'secondary.main' }}>
        <Grid container spacing={2}>
            <Grid item xs={7} sx={{ display: "flex", alignItems: "center", marginLeft: 1 }}>
                <Stack spacing={0}>
                    <Typography variant="caption" component="div" sx={{color: "text.secondary"}}>
                        Price
                    </Typography>
                    <Typography variant="body" component="h4" sx={{color: "text.primary"}}>
                        {price} ETH
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
