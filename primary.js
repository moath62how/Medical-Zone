const cluster = require("cluster");
const os = require("os");
const path = require("path");

const cpuCount = os.availableParallelism();

if (cluster.isPrimary) {
  cluster.setupPrimary({
    exec: path.join(__dirname, "server.js"), 
  });

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited`);
    console.log("Starting another worker");
    cluster.fork();
  });
} else {
  require(path.join(__dirname, "server.js")); 
}
