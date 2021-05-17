### 作用

WebSocket 对象提供了用于创建和管理的 WebSocket 连接，以及可以通过该连接去发送和接受数据的 Api

该协议分为两个阶段：握手阶段和数据通信阶段

简单而言，
可创建连接、打开连接 open、发送请求、接受请求、关闭连接、因错误自动关闭连接 error

### 事件

事件是绑定在 DOM 元素上的，可以通过 addEventListener(),dom 元素有几下几类事件：
关闭连接 close、开启连接 open、接受数据 message、因连接错误自动关闭时 error

### 服务端

服务端是创建服务，发送数据的一端，有几下功能：

### 初始化

npm init -y

### 新建 server 和 client 文件夹

先写服务端 server
在 server 里安装 ws ， 用于起一个服务
起一个服务器 new WebSocket.Server({port:3000})

###
