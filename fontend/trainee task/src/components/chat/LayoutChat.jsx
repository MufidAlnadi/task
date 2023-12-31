import React, { useEffect, useState, useRef } from "react";
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
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../../utils/FireBase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function LayoutChat() {
  const { userData } = useAuth();
  const ID = userData[3]?.value;
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [input, setInput] = React.useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  console.log(
    "🚀 ~ file: LayoutChat.jsx:32 ~ LayoutChat ~ chatMessages:",
    chatMessages
  );
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const lastMessageRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    axios.get("/subjects/getallsubjects").then((response) => {
      setSubjects(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3100/user/getadmin").then((response) => {
      setAdminUser(response.data);
    });
  }, []);

  const fetchStudents = () => {
    axios
      .get(`/subjects/${selectedSubject}/students/${ID}`)
      .then((response) => {
        setUsers(response.data);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedSubject, chatMessages]);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleSubject = (e) => {
    setSelectedSubject(e);
  };

  const handleSend = async () => {
    if (input.trim() !== "" && selectedUserId) {
      const newMessage = {
        text: input,
        sender: ID,
        timestamp: new Date().toISOString(),
      };
      const combinedId =
        ID > selectedUserId ? ID + selectedUserId : selectedUserId + ID;
      try {
        setIsLoading(true);
        const messagesRef = collection(db, "chats", combinedId, "messages");
        await setDoc(doc(messagesRef), newMessage);
        scrollToBottom();
        setInput("");
      } catch (err) {
        console.error("Error sending message:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setUsers([]);
    setSelectedUserId(null);
    setChatMessages([]);
  };

  const handleSelect = async (username, _id) => {
    setSelectedUserId(_id);
    const combinedId = ID > _id ? ID + _id : _id + ID;
    try {
      const messagesRef = query(
        collection(db, "chats", combinedId, "messages"),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await onSnapshot(messagesRef, (querySnapshot) => {
        const newMessages = [];
        querySnapshot.forEach((doc) => {
          newMessages.push(doc.data());
        });
        setChatMessages(newMessages.reverse());
      });

      scrollToBottom();
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);
  };

  const handleUpload = async () => {
    if (selectedImage) {
      const combinedId =
        ID > selectedUserId ? ID + selectedUserId : selectedUserId + ID;

      try {
        setIsLoading(true);

        const storageRef = ref(
          storage,
          `chatImages/${combinedId}/${Date.now()}_${selectedImage.name}`
        );
        await uploadBytes(storageRef, selectedImage);

        const downloadURL = await getDownloadURL(storageRef);

        const newMessage = {
          text: "",
          sender: ID,
          timestamp: new Date().toISOString(),
          imageUrl: downloadURL,
        };

        const messagesRef = collection(db, "chats", combinedId, "messages");
        await setDoc(doc(messagesRef), newMessage);

        scrollToBottom();

        setSelectedImage(null);
      } catch (err) {
        console.error("Error uploading image:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  ////////////////////
  return (
    <Grid container>
      <Grid item xs={3} sx={{ p: 2, backgroundColor: "grey.300" }}>
        <Search />
        <Typography variant="h6">Sidebar</Typography>
        <Typography variant="h6">{userData[0]?.value}</Typography>
        {adminUser && adminUser.length > 0 && (
          <Button
            key={adminUser[0]._id}
            value={adminUser[0]._id}
            variant="outlined"
            onClick={() =>
              handleSelect(adminUser[0].username, adminUser[0]._id)
            }
            fullWidth
          >
            {adminUser[0].username}
          </Button>
        )}
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
              {users.map(({ username, _id }) => (
                <Button
                  key={_id}
                  value={_id}
                  variant="outlined"
                  onClick={() => handleSelect(username, _id)}
                  fullWidth
                >
                  {username}
                </Button>
              ))}
            </div>
          </>
        ) : (
          subjects.map(({ name, _id }) => (
            <Button
              key={_id}
              variant="contained"
              color="primary"
              value={_id}
              onClick={(e) => handleSubject(e.target.value)}
              fullWidth
            >
              {name}
            </Button>
          ))
        )}
      </Grid>

      <Grid item xs={9}>
        <Box
          id="chat-messages-box"
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "grey.200",
            overflowY: "auto",
          }}
        >
          <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
            {chatMessages.map((message, index) => {
              const isUserMessage = message.sender === ID;
              const messageRef =
                index === chatMessages.length - 1 ? lastMessageRef : null;

              return (
                <Box
                  key={index}
                  ref={messageRef}
                  sx={{
                    display: "flex",
                    justifyContent: isUserMessage ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: isUserMessage
                        ? "secondary.light"
                        : "primary.light",
                      borderRadius: isUserMessage
                        ? "20px 20px 5px 20px"
                        : "20px 20px 20px 5px",
                    }}
                  >
                    {message.imageUrl ? (
                      <img src={message.imageUrl} alt="Uploaded" />
                    ) : (
                      <Typography variant="body1">{message.text}</Typography>
                    )}
                  </Paper>
                </Box>
              );
            })}
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
                  disabled={isLoading}
                >
                  Send
                </Button>
              </Grid>
              <Grid item xs={2}>
                <label htmlFor="image-upload">
                  <Button
                    fullWidth
                    size="large"
                    color="secondary"
                    variant="contained"
                    endIcon={<AddIcon />}
                    component="span"
                    disabled={isLoading}
                  >
                    Upload
                  </Button>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  fullWidth
                  size="large"
                  color="primary"
                  variant="contained"
                  onClick={handleUpload}
                  disabled={isLoading}
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
}

export default LayoutChat;
