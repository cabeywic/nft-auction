import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein: <Button>View</Button> };
}

const rows = [
  createData('Makrov', 159, 6.0, 24, 4.0),
  createData('Ghost', 237, 9.0, 37, 4.3),
  createData('Makrov', 262, 16.0, 24, 6.0),
  createData('Ghost', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}  sx={{ backgroundColor: "#303339", my: 2 }}>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="auction bid table">
        <TableHead>
          <TableRow>
            <TableCell>Bidder</TableCell>
            <TableCell align="right">Bid</TableCell>
            <TableCell align="right">Highest Bidder</TableCell>
            <TableCell align="right">Highest Binding Bid</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: "black" }}>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
