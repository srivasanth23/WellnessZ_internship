const express = require('express');
const sqlite3 = require("sqlite3");
//const multer = require('multer');
const path = require('path');
const {open} = require('sqlite');
var cors = require('cors')
const fileupload = require('express-fileupload');
require('dotenv').config();
const postroutes = require('./routes/posts.route');


const app = express();
const port = 3000 || 5000;
app.use(express.json())
app.use(cors())
app.use(fileupload({useTempFiles: true}))

//for creating a table (required only once to run)
//const db = new sqlite3.Database("./wellnessz.db", sqlite3.OPEN_READWRITE, (err) => {if (err) return console.error(err.message);});
//db.run(`CREATE TABLE posts (title VARCHAR(255) NOT NULL, description TEXT, tag VARCHAR(50), image_url VARCHAR(255));`);


const dbPath = path.join(__dirname, "wellnessz.db");

// Database Connection
const Connection = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(port, () => {
            console.log('Server started');
        });
    } catch (error) {
        console.log(`error message : ${error.message}`);
    }
}

Connection();



// Multer Storage
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

//routes
app.use("/posts", postroutes);

