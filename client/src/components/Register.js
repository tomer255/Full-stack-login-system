import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';
import { useHistory } from "react-router";



const theme = createTheme();


export default function Register() {
  const [passwordConfig,setPasswordConfig] = useState([]);
  const [userPassword,setUserPassword] = useState("");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getPasswordConfig();
  })

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        Axios.post("http://localhost:3005/register",{
          email : data.get('email'),
          password : data.get('password'),
          firstName : data.get('firstName'),
          lastName : data.get('lastName')
        }).then((response) => {
          enqueueSnackbar(response.data,{ variant : 'success'});
          history.push("/Login");
        })
        .catch((error) => {
          const massage = error.response ? error.response.data : "Network Error";
          enqueueSnackbar(massage,{ variant : 'error'});
        });
      };

      const getPasswordConfig = () => {
      Axios.get('http://localhost:3005/password_config')
      .then( (response) => {
        setPasswordConfig([response.data]);
      })
      .catch((error) => {
        const massage = error.response ? error.response.data : "Network Error";
        enqueueSnackbar(massage,{ variant : 'error'});
      })
      }
      

    
      return (
        <ThemeProvider theme={theme}>          
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
                      onChange={(event) => {setUserPassword(event.target.value)}}
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
                  passwordConfig.length !== 0 && (
                  <Alert severity={passwordConfig[0]["min password length"] <= userPassword.length?"success":"error"}>password must contain more than {passwordConfig[0]['min password length']} characters</Alert>
                  )
                }
                {
                  passwordConfig.length !== 0 && (
                    Object.keys(passwordConfig[0].character.settings).reduce((filtered, key) => {
                      if (passwordConfig[0].character.settings[key]) {
                        let re = new RegExp(passwordConfig[0].character.regex[key])
                         filtered.push(<Alert key={key} severity={re.test(userPassword)?"success":"error"}>{key}</Alert>);
                      }
                      return filtered;
                    }, [])
                  )
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