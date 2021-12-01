import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import PopUp from './PopUp'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useHistory } from "react-router";


export default function Dashboard() {
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const [search,setSearch] = useState("");
    const [noteList,setNoteList] = useState([]);
    const [popUpInfo,setPopUpInfo] = useState({});
    const history = useHistory();
    const headers = {
      "x-access-token": localStorage.getItem('token'),
  }

    useEffect(() => {
      if(headers["x-access-token"]){
        Axios.get("http://localhost:3005/authentication_status",
        {headers: headers}
        ).then((response) => {
          
        }).catch((error) => {
          history.push("/Login");

        });
      }
      else{
        history.push("/Login");
      }
      handleSearch();
    },[])

    const handleAddNote = () => {
        Axios.post("http://localhost:3005/addNote",{
          title : title,
          content : content
        },{headers: headers}
        ).then((response) => {
          handleSearch();
          setPopUpInfo({
            title: "server massage", 
            text: <Alert severity="success">{response.data}</Alert>,
            show: true
          });
        }).catch((error) => {
          setPopUpInfo({
            title: "server massage",
            text:<Alert severity="error">{error.response.data}</Alert>,
            show: true
          });
        });
      };

      const handleSearch = () => {
        Axios.post("http://localhost:3005/Search",{
            search : search
        },{headers: headers}
        ).then((response) => {
          setNoteList(response.data);
        }).catch((error) => {
          setPopUpInfo({
            title: "server massage",
            text:<Alert severity="error">{error.response.data}</Alert>,
            show: true
          });
        });
      };

      const handleRemoveNote = (item) => {
        Axios.post("http://localhost:3005/removeNote",{
            title : item.title
        },{headers: headers}
        ).then((response) => {
          handleSearch();
        }).catch((error) => {
          setPopUpInfo({
            title: "server massage",
            text:<Alert severity="error">{error.response.data}</Alert>,
            show: true
          });
        });
      };

      
    return (
        <div>
            <PopUp info={popUpInfo} handleClose={()=>{setPopUpInfo(false)}}>
            </PopUp>
            <h1>Dashboard</h1>
            <div>
            </div>
            <h3>Add note</h3>
            <label>Title:</label>
            <input type="text" 
            onChange={(event) => {setTitle(event.target.value)}}>
            </input>
            <br></br>
            <label>Content:</label>
            <input type="text"
            onChange={(event) => {setContent(event.target.value);}}>
            </input>
            <br></br>
            <button onClick={handleAddNote}>Add Note</button>
            <br></br><br></br>
            <div>
              <h3>my notes</h3>
                <label>search:</label>
                <input type="text"
                onChange={(event) => {setSearch(event.target.value)}}>
                </input>
                <button onClick={handleSearch}>search</button>
                <br></br>
                 {noteList.map((item)=>{
                  return(
                    <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {item.content}
                        </Typography>
                        <td><button onClick={()=>{handleRemoveNote(item)}}>Delete</button></td>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  );
                })}
            </div>
        </div>
    )
}
