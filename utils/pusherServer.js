const Pusher = require("pusher");

const pusherServer = new Pusher({
  appId: "1474541",
  key: "58efed017348be8ec435",
  secret: "26d4b469aed0367cb33b",
  cluster: "us2",
  useTLS: true
});


export default pusherServer;