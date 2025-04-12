import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';
import Logger from '../utils/Logger';

const wsClients: { [key: string]: WebSocket, lastSentData?: any } = {};

export const broadcast = async (data: any) => {
    wsClients['lastSentData'] = data
    for (const clientId in wsClients) {
        if (Object.prototype.hasOwnProperty.call(wsClients, clientId)) {
            const wsClient = wsClients[clientId];
            if (!!wsClient?.send) wsClient.send(JSON.stringify(data))
        }
    }
}

export default ((server: Server) => {
    const wsServer = new WebSocketServer({ server });
    wsServer.on('connection', (ws: WebSocket) => {
        if (!!ws) {
            const clientId: string = uuidv4();
            ws.on('message', (message: string) => {
                Logger.debug(`ws server received: ${message}`)
                const obj = JSON.parse(message)
                if (!!obj && !!Object.keys(obj).length) {
                    Logger.debug(obj)
                }
            });
            ws.on('close', () => {
                delete wsClients[clientId]
            });
            ws.send(JSON.stringify(wsClients['lastSentData']));
            wsClients[clientId] = ws
        }
    });
})
