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
} from "firebase/firestore";
import { db, storage } from "../../utils/FireBase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function AdminLayoutChat() {
  const { userData } = useAuth();
  const ID = userData[3]?.value;
  const [users, setUsers] = useState([]);
  const [input, setInput] = React.useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const lastMessageRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get("/subjects/getallsubjects").then((response) => {
      setSubjects(response.data);
    });
  }, []);

  const fetchstudents = () => {
    axios.get(`/user/getallusers`).then((response) => {
      setUsers(response.data);
    });
  };

  useEffect(() => {
    fetchstudents();
  }, [selectedSubject]);
 
  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
      }finally{
        setIsLoading(false)
      }
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
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
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);

        scrollToBottom();

        setSelectedImage(null);
      } catch (err) {
        console.error("Error uploading image:", err);
      }finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Grid container>
      <Grid item xs={3} sx={{ p: 2, backgroundColor: "grey.300" }}>
        <Search />
        <Typography variant="h6">Admin chat</Typography>
        {users.map((user) => (
          <Button
            key={user._id}
            value={user._id}
            variant="outlined"
            onClick={() => handleSelect(user.username, user._id)}
            fullWidth
          >
            {user.username}
          </Button>
        ))}
      </Grid>
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
                    file
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

export default AdminLayoutChat;
