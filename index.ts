import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import IndexRouter from './routes/indexroute';
import {Server} from 'socket.io'

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

app.use('/' , IndexRouter);


const server = app.listen(process.env.PORT , () => {
    console.log(`The server is up on port : ${process.env.PORT}`);
})

const io = new Server(server , {
    pingTimeout : 60000,
      cors : {
         origin : "*",
         methods : ["GET" , "POST"],
         credentials : true
      }
})

io.on("connection" , (socket) => {

     socket.on("join-chat" , (roomID) => {
        socket.join(roomID);
        console.log("user joined room" , roomID);

     })

     socket.on("send-message" , (data) => {
        console.log(data);
        socket.to(data.roomId).emit("recieve-message",data.message);
    })


    socket.on("disconnect" , () => {
        console.log(`user disconnected : ${socket.id}`)
    })
})





