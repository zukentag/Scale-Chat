const http = require("http");
import socketService from "./services/socket";

async function init() {
  const SocketService = new socketService();
  const httpServer = http.createServer();
  const Port = process.env.PORT || 8000;

  SocketService.io.attach(httpServer);

  SocketService.eventListner();
  httpServer.listen(Port, () => {
    console.log(`Server started at port ${Port}`);
  });
}

init();
