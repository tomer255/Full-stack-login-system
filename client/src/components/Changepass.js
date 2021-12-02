import React from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
  
  const theme = createTheme();

export default function ChangePass() {
  const { enqueueSnackbar } = useSnackbar();
  const headers = {
    "x-access-token": localStorage.getItem('token'),
}

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if(data.get('newPassword') === data.get('validatePassword')){
          Axios.post("http://localhost:3005/changePassword",{
            currentPassword : data.get('currentPassword'),
            newPassword : data.get('newPassword'),
          },{headers: headers}
          ).then((response) => {
            enqueueSnackbar(response.data,{ variant : 'success'});
          })
          .catch((error) => {
            const massage = error.response ? error.response.data : "Network Error";
            enqueueSnackbar(massage,{ variant : 'error'});
          });
        }else{
          enqueueSnackbar("passwords dont mach",{ variant : 'error'});
        }

      };
    
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
                Change Password
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="currentPassword"
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  id="newPassword"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="validatePassword"
                  label="Validate Password"
                  type="password"
                  id="validatePassword"
                />
             
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Change Password
                </Button>
           
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );
    }