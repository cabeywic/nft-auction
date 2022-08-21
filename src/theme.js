import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette:{
    type: 'dark',
    primary: {
        main: '#c0392b',
        light: '#303339', 
        dark: '#222'
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
  components: {
    MuiPaper: {
      styleOverrides: {
          root: {
              backgroundColor: '#333',
          },
      }
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
            backgroundColor: '#111',
        },
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
            color: '#fff',
        },
      }
    }
  },
});

export default theme;
