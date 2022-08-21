import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import web3 from '../ethereum/web3';

function createData(bidder, bid, highestBidder, highestBindingBid) {
  return { bidder, bid, highestBidder, highestBindingBid, viewButton: <Button>View</Button> };
}

function textEllipsis(str, maxLength = 10, { side = "end", ellipsis = "..." } = {}) {
  if (str.length > maxLength) {
    switch (side) {
      case "start":
        return ellipsis + str.slice(-(maxLength - ellipsis.length));
      case "end":
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }
  return str;
}

export default function AuctionBidTable(props) {
  let rows = []

  for(let row of props.bids){
    const { bidder, bid, highestBidder, highestBindingBid } = row.returnValues;
    rows.push(createData(bidder, bid, highestBidder, highestBindingBid))
  }
  
  return (
    <TableContainer component={Paper}  sx={{ backgroundColor: "#303339", my: 2 }}>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="auction bid table">
        <TableHead>
          <TableRow>
            <TableCell>Bidder</TableCell>
            <TableCell align="right">Bid</TableCell>
            <TableCell align="left">Highest Bidder</TableCell>
            <TableCell align="right">Highest Binding Bid</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: "black" }}>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {textEllipsis(row.bidder)}
              </TableCell>
              <TableCell align="right">{web3.utils.fromWei(row.bid, 'ether')} ETH</TableCell>
              <TableCell align="left">{textEllipsis(row.highestBidder)}</TableCell>
              <TableCell align="right">{web3.utils.fromWei(row.highestBindingBid, 'ether')} ETH</TableCell>
              <TableCell align="right">{row.viewButton}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
