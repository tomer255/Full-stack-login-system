import React, {useEffect, useState} from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Axios from "axios";
import Alert from "@mui/material/Alert";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router";
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const server = 'https://localhost:3005';

export default function Register() {
    const [passwordConfig, setPasswordConfig] = useState([]);
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [UserPasswordvalues, setUserPasswordValues] = useState({
        password: "",
        showPassword: false,
    });

    const getPasswordConfig = () => {
        Axios.get(server + '/passwordRequirements')
            .then((response) => {
                setPasswordConfig([response.data]);
                enqueueSnackbar("password requirements set", {variant: 'success'});
            })
            .catch((error) => {
                const message = error.response ? error.response.data : "Network Error";
                enqueueSnackbar(message, {variant: "error"});
            });
    };


    useEffect(() => {
        getPasswordConfig();
    }, []);

    const handleClickShowPassword = () => {
        setUserPasswordValues({
            ...UserPasswordvalues,
            showPassword: !UserPasswordvalues.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (prop) => (event) => {
        setUserPasswordValues({...UserPasswordvalues, [prop]: event.target.value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        Axios.post(server + "/register", {
            email: data.get("email"),
            password: UserPasswordvalues.password,
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
        })
            .then((response) => {
                enqueueSnackbar(response.data, {variant: "success"});
                history.push("/Login");
            })
            .catch((error) => {
                const message = error.response ? error.response.data : "Network Error";
                enqueueSnackbar(message, {variant: "error"});
            });
    };


    return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>

                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{mt: 3}}
                    >
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
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">
                                        Password
                                    </InputLabel>
                                    <OutlinedInput
                                        id="password"
                                        label="Password"
                                        fullWidth
                                        type={UserPasswordvalues.showPassword ? "text" : "password"}
                                        value={UserPasswordvalues.password}
                                        onChange={handleChange("password")}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {UserPasswordvalues.showPassword ? (
                                                        <VisibilityOff/>
                                                    ) : (
                                                        <Visibility/>
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        {passwordConfig.length !== 0 && (
                            <Alert
                                severity={
                                    passwordConfig[0]["min password length"] <=
                                    UserPasswordvalues.password.length
                                        ? "success"
                                        : "error"
                                }
                            >
                                password must contain more than{" "}
                                {passwordConfig[0]["min password length"]} characters
                            </Alert>
                        )}
                        {passwordConfig.length !== 0 &&
                            Object.keys(passwordConfig[0].character.settings).reduce(
                                (filtered, key) => {
                                    if (passwordConfig[0].character.settings[key]) {
                                        let re = new RegExp(passwordConfig[0].character.regex[key]);
                                        filtered.push(
                                            <Alert
                                                key={key}
                                                // severity={re.test(userPassword) ? "success" : "error"}
                                                severity={re.test(UserPasswordvalues.password) ? "success" : "error"}

                                            >
                                                {key}
                                            </Alert>
                                        );
                                    }
                                    return filtered;
                                },
                                []
                            )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
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
    );
}
