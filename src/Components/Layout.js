import * as React from 'react';
import Container from '@mui/material/Container';
import Header from './Header';

export default function Layout(props) {
  return (
    <Container>
        <Header />
        {props.children}
    </Container>
  );
}
