import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Search from "./Massages";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../utils/FireBase";

const messages = [
  { id: 1, text: "Hi there!", sender: "bot" },
  { id: 2, text: "Hello!", sender: "user" },
  { id: 3, text: "How can I assist you today?", sender: "bot" },
];

const ChatUI = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = React.useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [firebaseUsers, setFirebaseUsers] = useState([]);

  const { userData } = useAuth();
  const currentUserName = userData[0]?.value;
  const usernamesInState = users.map((user) => user.username);
  const filteredUsernames = usernamesInState.filter(
    (username) => username !== currentUserName
  );
  const filteredCurrentUser = usernamesInState.filter(
    (username) => username === currentUserName
  );
  const filteredState = firebaseUsers.filter((user) =>
    filteredUsernames.includes(user.username)
  );
  const filteredCurrentUserState = firebaseUsers.filter((user) =>
    filteredCurrentUser.includes(user.username)
  );

  useEffect(() => {
    axios
      .get("http://localhost:3100/subjects/getallsubjects")
      .then((response) => {
        setSubjects(response.data);
      });
  }, []);

  const fetchstudents = () => {
    axios.get(`/subjects/${selectedSubject}/students`).then((response) => {
      setUsers(response.data);
    });
  };

  const getUsersFirebase = async () => {
    const q = query(collection(db, "users"));
    try {
      const querySnapshot = await getDocs(q);
      const firebaseUsers = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      setFirebaseUsers(firebaseUsers);
    } catch (error) {
      console.error("Error querying Firestore:", error);
    }
  };
  const handleSubject = (e) => {
    setSelectedSubject(e);
    getUsersFirebase();
  };

  useEffect(() => {
    fetchstudents();
    getUsersFirebase();
  }, [selectedSubject]);

  useEffect(() => {
    fetchstudents();
  }, [firebaseUsers]);

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
    setFirebaseUsers([]);
    setSelectedUser(null);
  };

  const handleSelect = async (username, uid) => {
    console.log(
      "🚀 ~ file: ChatBox.jsx:132 ~ handleSelect ~ username:",
      username
    );
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      filteredCurrentUserState.uid > uid
        ? filteredCurrentUserState.uid + uid
        : uid + filteredCurrentUserState.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", filteredCurrentUserState.uid), {
          [combinedId + ".userInfo"]: {
            uid: uid,
            displayName: username,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: filteredCurrentUserState.uid,
            displayName: filteredCurrentUserState.displayName,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid container>
      {/* Sidebar */}

      <Grid item xs={3} sx={{ p: 2, backgroundColor: "grey.300" }}>
        <Search />
        <Typography variant="h6">Sidebar</Typography>
        <Typography variant="h6">{userData[0]?.value}</Typography>
        {/* Render subject names with click event */}
        {selectedSubject ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              fullWidth
            >
              Back
            </Button>
            <div>
              {filteredState.map(({ username, uid }, index) => (
                <Button
                  key={uid}
                  value={uid}
                  variant="outlined"
                  onClick={() => handleSelect(username, uid)}
                  fullWidth
                >
                  {username}
                </Button>
              ))}
            </div>
          </>
        ) : (
          subjects.map(({ name, _id }) => (
            <>
              <Button
                key={_id}
                variant="contained"
                color="primary"
                disabled={isLoading}
                value={_id}
                onClick={(e) => handleSubject(e.target.value)}
                fullWidth
              >
                {name}
              </Button>
            </>
          ))
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
