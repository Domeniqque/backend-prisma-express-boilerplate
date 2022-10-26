import { App } from "./bootstrap";
import { AppConfig } from "./config";

App.listen(AppConfig.PORT, () => {
  console.log(`App running on http://localhost:${AppConfig.PORT} 🚀`);
});
