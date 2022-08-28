import { Server as HttpServer } from "http";
import { Server } from "../server";
import { composeApplication, dispose } from "./CompositionRoot";

export * from "./CompositionRoot";

export default function AppFactory(): App {
  return new App();
}

class App {
  private server!: Server;
  private httpServer!: HttpServer;

  constructor() {
    process.once("SIGINT", this.stop.bind(this));
    process.once("SIGUSR1", this.stop.bind(this));
  }

  async stop(): Promise<void> {
    this.httpServer.close();
    await dispose();
    process.exit(0);
  }

  async start(): Promise<void> {
    await composeApplication();

    this.server = new Server();
    this.httpServer = await this.server.launch();
  }
}
