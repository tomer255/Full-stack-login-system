import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import PopUp from './PopUp'
import Alert from '@mui/material/Alert';



const theme = createTheme();
let bool = true;
console.log(bool);

export default function Register() {
  const [popUpInfo,setPopUpInfo] = useState({});
  const [passwordConfig,setPasswordConfig] = useState([]);

  useEffect(() => {
    bool = getPasswordConfig();
  },[])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        Axios.post("http://localhost:3005/register",{
          email : data.get('email'),
          password : data.get('password'),
          firstName : data.get('firstName'),
          lastName : data.get('lastName')
        }).then((response) => {
          setPopUpInfo({
            title: "server massage",
            text: <Alert severity="success">{response.data}</Alert>,
            show: true
          });
        })
        .catch((error) => {
          setPopUpInfo({
            title: "server massage", 
            text:<Alert severity="error">{error.response.data}</Alert>,
            show: true
          });
        });
      };

      const getPasswordConfig = () =>{
      Axios.get('http://localhost:3005/password_config')
      .then( (response) => {
        // console.log(response.data);
        setPasswordConfig([response.data]);
        // console.log(passwordConfig);
        return true;
      })
      .catch((error) => {
        // handle error
        console.log(error);
        return false;
      })
      }
      
      
      // Axios.get('http://localhost:3005/password_config')
      // .then( (response) => {
      //   // console.log(response.data);
      //   // setPasswordConfig(response.data);
      //   // console.log(passwordConfig);
      // })
      // .catch((error) => {
      //   // handle error
      //   console.log(error);
      // })

    // console.log("test");

    
      return (
        <ThemeProvider theme={theme}>
          <PopUp info={popUpInfo} handleClose={()=>{setPopUpInfo(false)}}>
            </PopUp>
          <Container component="main" maxWidth="xs">
            
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
            <h1>{bool === true ? "yes" : "no"}</h1>
            
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="validatePassword"
                    label="Validate Password"
                    type="validatePassword"
                    id="validatePassword"
                  />
                  </Grid> */}
                </Grid>
                {
                  // console.log(passwordConfig)
                  // Object.keys(passwordConfig[0].settings).map((key, index) => {
                  //   console.log(key,":",index);
                  // })
                }
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/Login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );
    }