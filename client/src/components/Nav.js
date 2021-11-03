import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useHistory } from "react-router";

export default function Nav() {

  const history = useHistory();
  
  const navArray = [
    {
      title: "register",
      function: () => {
        history.push("/register");
      },
    },

    {
      title: "Change Password",
      function: () => {
        history.push("/changepass");
      },
    },
    {
      title: "Login",
      function: () => {
        history.push("/Login");
      },
    },

    {
      title: "Dashboard",
      function: () => {
        history.push("/dashboard");
      },
    },

    {
      title: "Forgot Password",
      function: () => {
        history.push("/forgotpass");
      },
    },
  ];


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {navArray.map((item) => {
            return(
            <Typography m={2} t={3} variant="h6" component="div">
              <Button onClick={item.function} color="inherit">
                {item.title}
              </Button>
            </Typography>
            )
          })}

        
        </Toolbar>
      </AppBar>
    </Box>
  );
}
