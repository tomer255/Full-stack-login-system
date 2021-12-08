import React, { useState, useEffect } from "react";
import Axios from "axios";
import PopUp from "./PopUp";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useHistory } from "react-router";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

const theme = createTheme();

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [noteList, setNoteList] = useState([]);
  const [popUpInfo, setPopUpInfo] = useState({});
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const headers = {
    "x-access-token": localStorage.getItem("token"),
  };

  useEffect(() => {
    if (headers["x-access-token"]) {
      Axios.get("http://localhost:3005/authentication_status", {
        headers: headers,
      })
        .then((response) => {
          searchNots(search);
        })
        .catch((error) => {
          history.push("/Login");
        });
    } else {
      history.push("/Login");
    }
  });

  const handleAddNote = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    Axios.post(
      "http://localhost:3005/addNote",
      {
        title: data.get("title"),
        content: data.get("content"),
      },
      { headers: headers }
    )
      .then((response) => {
        searchNots(search);
        enqueueSnackbar(response.data, { variant: "success" });
      })
      .catch((error) => {
        const massage = error.response ? error.response.data : "Network Error";
        enqueueSnackbar(massage, { variant: "error" });
      });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSearch(data.get("search"));
    searchNots(search);
  };

  const searchNots = (text) => {
    Axios.post(
      "http://localhost:3005/Search",
      {
        search: text,
      },
      { headers: headers }
    )
      .then((response) => {
        setNoteList(response.data);
      })
      .catch((error) => {
        const massage = error.response ? error.response.data : "Network Error";
        enqueueSnackbar(massage, { variant: "error" });
      });
  };

  const handleRemoveNote = (item) => {
    Axios.post(
      "http://localhost:3005/removeNote",
      {
        title: item.title,
      },
      { headers: headers }
    )
      .then((response) => {
        searchNots(search);
      })
      .catch((error) => {
        const massage = error.response ? error.response.data : "Network Error";
        enqueueSnackbar(massage, { variant: "error" });
      });
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabStyle = {
    position: "absolute",
    bottom: 16,
    right: 16,
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <PopUp
          info={popUpInfo}
          handleClose={() => {
            setPopUpInfo(false);
          }}
        ></PopUp>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Typography component="h1" variant="h3">
              Dashboard
              </Typography> */}

          <Box
            component="form"
            noValidate
            onSubmit={handleAddNote}
            sx={{ mt: 3 }}
          >
            <Typography component="h1" variant="h5">
              Add note
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  id="Content"
                  label="Content"
                  name="content"
                />
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Note
              </Button>
            </Grid>
          </Box>

          <Box
            component="form"
            noValidate
            onSubmit={handleSearch}
            sx={{ mt: 3 }}
          >
            <Typography component="h1" variant="h5">
              My Notes
            </Typography>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={6} sm={14}>
                <TextField
                  required
                  fullWidth
                  id="search"
                  label="Search"
                  name="search"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  search
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {noteList.map((item) => {
                return (
                  <Grid item xs={6}>
                    <Card sx={{ maxWidth: 300 }}>
                      <CardActionArea>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {item.title}
                          </Typography>
                          {/* <div contentEditable='true' dangerouslySetInnerHTML={{ __html: item.content }}></div> XSS */}
                          <Typography variant="body2" color="text.secondary">
                            {item.content}
                          </Typography>

                          <Tooltip
                            sx={fabStyle}
                            title="Delete"
                            placement="right"
                            onClick={() => {
                              handleRemoveNote(item);
                            }}
                          >
                            <IconButton>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
