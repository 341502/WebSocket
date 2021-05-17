const WebSocket = require("ws");
const http = require("http");
const wss = new WebSocket.Server({ noServer: true });
const server = http.createServer();

const jwt = require("jsonwebtoken"); // 解析客户端发送过来的token信息

// const wss = new WebSocket.Server({
//   port: 3000,
//   //   perMessageDeflate: {
//   //     zlibDeflateOptions: {
//   //       // See zlib defaults.
//   //       chunkSize: 1024,
//   //       memLevel: 7,
//   //       level: 3,
//   //     },
//   //     zlibInflateOptions: {
//   //       chunkSize: 10 * 1024,
//   //     },
//   //     // Other options settable:
//   //     clientNoContextTakeover: true, // Defaults to negotiated value.
//   //     serverNoContextTakeover: true, // Defaults to negotiated value.
//   //     serverMaxWindowBits: 10, // Defaults to negotiated value.
//   //     // Below options specified as default values.
//   //     concurrencyLimit: 10, // Limits zlib concurrency for perf.
//   //     threshold: 1024, // Size (in bytes) below which messages
//   //     // should not be compressed.
//   //   },
// });

// 多聊天室 - 通过roomid来判断
let group = {};
// let total = 0;

// 当有新的连接过来时 执行后面的方法
wss.on("connection", function connection(ws) {
  console.log("one client is connection");
  // 接受客户端消息
  ws.on("message", function (msg) {
    var msgObj = JSON.parse(msg);

    if (msgObj.event === "enter") {
      ws.name = msgObj.message;
      ws.roomid = msgObj.roomid;

      if (typeof group[ws.roomid] === "undefined") {
        group[ws.roomid] = 1;
      } else {
        group[ws.roomid]++;
      }
      // total++;
    }

    // 鉴权
    if (msgObj.event === "auth") {
      jwt.verify(msgObj.message, "secret", (err, decode) => {
        if (err) {
          // websocket返回前台一个鉴权失败的消息
          console.log("auth err");
          return;
        } else {
          // 鉴权通过
          console.log(decode);
          ws.isAuth = true;
          return;
        }
      });
    }

    // 主动发送消息给客户端 - 只给发送消息的客户端发送消息
    // ws.send(msg);

    // 广播消息  wss.client 获得所有的客户端
    wss.clients.forEach((client) => {
      // 非自己的客户端且没有关闭的客户端ws !== client
      if (client.readyState === WebSocket.OPEN && client.roomid === ws.roomid) {
        msgObj.total = group[ws.roomid];
        msgObj.name = ws.name;
        client.send(JSON.stringify(msgObj));
      }
    });
  });

  // 主动发送消息给客户端
  // ws.send("Message from server");

  // 当有用户退出时，断开连接时 也应该有提示
  ws.on("close", function () {
    if (ws.name) group[ws.roomid]--;
    let msgObj = {};
    // 广播消息  wss.client 获得所有的客户端
    wss.clients.forEach((client) => {
      // 非自己的客户端且没有关闭的客户端ws !== client
      if (client.readyState === WebSocket.OPEN && ws.roomid === client.roomid) {
        msgObj.name = ws.name;
        msgObj.total = group[ws.roomid];
        msgObj.event = "out";
        client.send(JSON.stringify(msgObj));
      }
    });
  });
});

// 鉴权
// wss.on("connection", function connection(ws, request, client) {
//   ws.on("message", function message(msg) {
//     console.log(`Received message ${msg} from user ${client}`);
//   });
// });

server.on("upgrade", function upgrade(request, socket, head) {
  console.log("TCL: upgrade -> request", request);
  // This function is not defined on purpose. Implement it with your own logic.
  // authenticate(request, (err, client) => {
  //   if (err || !client) {
  //     socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  //     socket.destroy();
  //     return;
  //   }

  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit("connection", ws, request);
  });
  // });
});

server.listen(3000);
