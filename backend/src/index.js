const express = require('express');
const app = express();
require('./db/mongoose');
const userRouter = require('./routes/users');
const noticeRouter = require('./routes/notice');
const dateRouter = require('./routes/impdates');
const galleryRouter = require('./routes/gallery');


const port = process.env.PORT || 3000;


// TODO Change the name of the files in models folder to remove confusion !!
// TODO Install all the necessary packages in the src directory and delete the package.json file in the backend directory !!

app.use(express.json());
app.use(userRouter);
app.use(noticeRouter);
app.use(dateRouter);
app.use(galleryRouter);



app.listen(port, () => console.log('Server Up! and sound on port ' + port));