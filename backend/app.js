const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectionParams, MONGO_URL } = require('./app/config/config');
const UserRoutes = require('./app/routes/UserRoutes')
const TokenRoutes = require('./app/routes/TokenRoutes')
const SubjectRoutes= require('./app/routes/SubjectRoutes')
const MarksRoutes= require('./app/routes/MarksRoutes')
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(MONGO_URL, connectionParams)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3100, () => {
  console.log("Server running on port 3100");
});

 app.use('/user' , UserRoutes );
 app.use('/token',TokenRoutes)
 app.use('/subjects', SubjectRoutes)
 app.use('/marks', MarksRoutes)