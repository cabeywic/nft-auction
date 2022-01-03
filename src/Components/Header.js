import * as React from 'react';
import {AppBar, Toolbar, Typography, Button, Box, Stack} from '@mui/material';
import { Link } from '../routes';

const styles = {
    root: {
      flexGrow: 1,
      marginBottom: '10px',
    },
    menuButton: {
      marginRight: '10px',
    },
    title: {
      flexGrow: 1
    },
};

export default function Header() {
  return (
    <Box sx={styles.root}>
        <AppBar position="static" color="transparent">
            <Toolbar>
              <Typography variant="h5" component="h1" sx={styles.title}>
                  Next Auctions
              </Typography>
                <Stack spacing={2} direction="row">
                    <Link route="/auctions/new"><Button color="primary" variant="contained">Create Auction</Button></Link>
                    <Link route="/"><Button color="primary" variant="contained">View Auctions</Button></Link>
                </Stack>
            </Toolbar>
        </AppBar>
    </Box>
  );
}

