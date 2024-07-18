import { Server } from "socket.io";
import { Redis } from "ioredis";
require("dotenv").config();

const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT ?? "6379"),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});
const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT ?? "6379"),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

class Socket {
  private _io: Server;

  constructor() {
    console.log("Socket Server...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public eventListner() {
    const io = this._io;
    io.on("connect", (socket) => {
      console.log("New user connectef to socket : ", socket.id);

      socket.on("event:message", async (message: String) => {
        console.log("msg --- >", message);
        await pub.publish("MESSAGES", JSON.stringify(message));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("emitting--->", message);
        io.emit("messageRec", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default Socket;
