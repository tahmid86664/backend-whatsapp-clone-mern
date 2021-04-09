// importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Rooms from './dbRoom.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1184434",
  key: "ef58f716c05b59e89841",
  secret: "2497437e533a3d7a61f8",
  cluster: "eu",
  useTLS: true
});


// middleware
app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "*");
//     next();
// })


// db config
const connectionUrl = 'mongodb+srv://admin:W6hYu6JBLs7ChUEH@cluster0.rdpag.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', ()=> {
    console.log("db is connected")

    const msgCollection = db.collection("messages");
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log(change);

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timeStamp: messageDetails.timeStamp,
                received: messageDetails.received,
                roomId: messageDetails.roomId
            }); // first is channel, second is event, third is data
        } else {
            console.log("Error triggering pusher");
        }
    })
});

// ????


// api routes
app.get('/', (req, res) => {
    res.status(200).send("Hello World");
});

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    });
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    // console.log(req.body)

    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    });
});

app.get('/rooms/sync', (req, res) => {
    Rooms.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    });
});

app.post('/rooms/create', (req, res) => {
    const dbRoom = req.body
    // console.log(req.body)

    Rooms.create(dbRoom, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    });
});


// listen
app.listen(port, () => {
    console.log(`listenin on localhost: ${port}`);
});

