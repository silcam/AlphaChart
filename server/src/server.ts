import app from "./app";
import log from "./common/log";

app.listen(app.get("port"), () => {
  log.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
