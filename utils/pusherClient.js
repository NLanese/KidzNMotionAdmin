import Pusher from "pusher-js";

var pusherClient = new Pusher("58efed017348be8ec435", {
  cluster: "us2",
});

export default pusherClient
