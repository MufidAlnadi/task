import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Search from "./Massages";

const messages = [
  { id: 1, text: "Hi there!", sender: "bot" },
  { id: 2, text: "Hello!", sender: "user" },
  { id: 3, text: "How can I assist you today?", sender: "bot" },
];

const ChatUI = (props) => {
  const [input, setInput] = React.useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { userData } = useAuth();
 
  const currentUserId = userData[0]?.value;
  useEffect(() => {
    axios
      .get("http://localhost:3100/subjects/getallsubjects")
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  const fetchstudents = () => {
    axios
      .get(`/subjects/getsubjectsstudent/${selectedSubject}`)
      .then((response) => {
        setUsers(response.data);
      });
  };
  const getUsersFirebase = () => {};

  useEffect(() => {
    fetchstudents();
  }, [selectedSubject]);

  const handleSend = () => {
    if (input.trim() !== "") {
      console.log(input);
      setInput("");
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setUsers([]);
    setSelectedUser(null);
  };

  return (
    <Grid container>
      {/* Sidebar */}


      <Grid item xs={3} sx={{ p: 2, backgroundColor: "grey.300" }}>
      <Search/>

        <Typography variant="h6">Sidebar</Typography>
        <Typography variant="h6">{userData[0]?.value}</Typography>
        {/* Render subject names with click event */}
        {selectedSubject ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            fullWidth
          >
            Back
          </Button>
        ) : (
          subjects.map(({ name, _id }) => (
            <>
              <Button
                key={_id}
                variant="contained"
                color="primary"
                value={_id}
                onClick={() => setSelectedSubject(_id)}
                fullWidth
              >
                {name}
              </Button>
            </>
          ))
        )}
        {/* Render user list when  subject is selected */}{" "}
        {users && (
          <div>
            {users.map(({ username, _id }, index) => (
              <Button
                key={index}
                value={_id}
                variant="outlined"
                onClick={() => setSelectedUser(_id)}
                fullWidth
              >
                {username}
              </Button>
            ))}
          </div>
        )}
      </Grid>

      {/* Chat Area */}
      <Grid item xs={9}>
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "grey.200",
          }}
        >
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </Box>
          <Box sx={{ p: 2, backgroundColor: "background.default" }}>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message"
                  variant="outlined"
                  value={input}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  size="large"
                  color="primary"
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSend}
                >
                  Send
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  size="large"
                  color="secondary"
                  variant="contained"
                  endIcon={<AddIcon />}
                >
                  Upload
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const Message = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor: isBot ? "primary.light" : "secondary.light",
          borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
      </Paper>
    </Box>
  );
};

export default ChatUI;
