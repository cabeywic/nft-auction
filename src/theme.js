import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette:{
    type: 'dark',
    primary: {
        main: '#c0392b'
    },
    secondary: {
        main: '#8a9394',
        text: "#8a9394"
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#202225",
    },
    text:{
      primary: "#FFFFFF",
      secondary: "#8a9394"
    }
  },
});

export default theme;
