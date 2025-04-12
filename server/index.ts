import app from './src/configs/app';
import Logger from './src/utils/Logger';
import cluster from 'cluster';
import os from 'os';
import webSocket from './src/configs/webSocket'

const PORT = process.env.SERVER_PORT;

Logger.debug(`Worker ${process.pid} started`);
    
const server = app.listen(PORT, () => {
    Logger.info(`App listening on port ${PORT}`);
});


webSocket(server)
// if (process.env.MODE === 'PROD' && cluster.isPrimary) {
//     // Count the machine's CPUs
//     const cpuCount = os.cpus().length;
    
//     // Create a worker for each CPU
//     for (let i = 0; i < cpuCount; i += 1) {
//         cluster.fork();
//     }
    
//     // Listen for worker exit and fork a new one
//     cluster.on('exit', (worker, code, signal) => {
//         Logger.info(`Worker ${worker.process.pid} died`);
//         cluster.fork();
//     });
// } else {
//     // Workers can share any TCP connection
//     // In this case, it is an HTTP server
//     Logger.debug(`Worker ${process.pid} started`);
    
//     app.listen(PORT, () => {
//         Logger.info(`App listening on port ${PORT}`);
//     });
// }