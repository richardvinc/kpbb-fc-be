import cluster, { Worker } from "cluster";
import { cpus } from "os";
import app from "./app";

const workers: { [key: number]: Worker } = {};

function spawn(): void {
  const worker = cluster.fork();
  console.log(`spawn worker ${worker.id}`);
  workers[worker.id] = worker;
}

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    spawn();
  }
  cluster.on("exit", (worker) => {
    console.log(`worker ${worker.id} died. spawing a new process`);
    delete workers[worker.id];
    spawn();
  });
} else {
  app().start();
}
