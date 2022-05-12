import React from "react";
import Nav from "./Nav";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Register from "./Register.js";
import ChangePass from "./Changepass.js";
import Login from "./Login.js";
import Dashboard from "./Dashboard";
import Forgotpass from "./Forgotpass";
import Resetpass from "./Resetpass";
import { SnackbarProvider } from "notistack";
import {ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const initmode = prefersDarkMode ? 'dark' : 'light';
  console.log(prefersDarkMode);
  const [mode, setMode] = React.useState(initmode);
  const theme = React.useMemo(() => createTheme({palette: { mode,},}),[mode],);
  const toggleColorMode = ()=>{setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));}

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <SnackbarProvider maxSnack={5}>
            <Nav toggleColorMode={toggleColorMode} />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/changepass" component={ChangePass} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/forgotpass" component={Forgotpass} />
              <Route exact path="/resetpass/:id/:token" component={Resetpass} />
            </Switch>
          </SnackbarProvider>
        </BrowserRouter>
      </ThemeProvider>      
    </div>
  );
}