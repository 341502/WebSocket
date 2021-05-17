/**
 * ws除了作为服务端使用  在node侧还可以当作一个客户端来使用
 *
 * 来充当server服务端
 */

const WebSocket = require("ws");

const ws = new WebSocket("ws://127.0.0.1:3000");

// 监听客户端的open方法  后面是 监听到客户端的open方法后执行的一个回调
ws.on("open", function () {
  console.log("client is connected to Server");

  ws.send("client say hello to server");

  ws.on("message", function (msg) {
    console.log(msg);
  });
});
