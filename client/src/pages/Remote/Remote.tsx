import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { PassageContent } from '../../features/biblePassageSearch/biblePassageSearchSlice';
import Logger from '../../utils/Logger';
import { PassageDisplay } from '../../features/biblePassageSearch/components/PassageDisplay';

interface RemoteProps { }

export const Remote: React.FC<RemoteProps> = () => {
    const [ searchParams ] = useSearchParams();
    const sessionId = searchParams.get('session')
    const [ passageContent, setPassageContent ] = useState<PassageContent | null>(null)

    useEffect(() => {
        const ws = new WebSocket(process.env.REACT_APP_WS_URL || '');
        ws.onopen = (event) => {
            Logger.debug('WebSocketServer has been connected')
            ws.send(JSON.stringify({ sessionId: sessionId }))
        };
        ws.onmessage = (event) => {
            try {
                const eventData = JSON.parse(event.data);
                Logger.debug('ws client received: ', eventData)
                setPassageContent(eventData);
            } catch (error) {
                Logger.error('Error parsing ws message', error)
            }
        };
        ws.onerror = async (event) => {
            Logger.debug('WebSocketServer has been closed')
            closeWs(ws)
        }
        const closeWs = (ws: WebSocket) => {
            if (ws.readyState === WebSocket.OPEN) {
                Logger.debug('Closing webSocketClient...')
                ws.close();
            }
        }
        return () => closeWs(ws)
    }, [sessionId])

    return (
        <div style={{ margin: '0px 90px' }}>
            <Helmet>
                <title>BHP | Remote</title>
                <style>{`body { background-color: transparent !important; /*background: radial-gradient(circle, rgba(138,224,255,1) 0%, rgba(45,192,235,0.9951330874146533) 33%, rgba(4,80,155,1) 100%);*/ }`}</style>
            </Helmet>
            <Grid container alignItems={'center'} justifyContent={'center'} style={{ minHeight: '900px', width: '100%', }}>
                <Grid item alignItems={'center'} textAlign={'center'} justifyContent={'center'} style={{ height: '100%', width: '100%' }}>
                    <PassageDisplay content={passageContent} 
                        contentProps={{
                            fontSize: '95%',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}