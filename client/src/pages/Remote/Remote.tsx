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
    const doTransparentBackground = JSON.parse(searchParams.get('transparentBackground') || 'false')
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
    }, [])

    return (
        <div style={{ margin: '0px 90px' }}>
            <Helmet>
                <title>BHP | Remote</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"></link>
                {/* <link href="https://fonts.googleapis.com/css2?family=Carter+One&display=swap" rel="stylesheet"></link> */}
                {/* font-family: "Carter One", system-ui;
                        font-weight: 400;
                        font-style: normal; */}

                {/* <link href="https://fonts.googleapis.com/css2?family=Calistoga&display=swap" rel="stylesheet"></link> */}
                {/* font-family: "Calistoga", serif;
                        font-weight: 400;
                        font-style: normal; */}

                <link href="https://fonts.googleapis.com/css2?family=Calistoga&family=Freeman&family=Palanquin+Dark:wght@400;500;600;700&display=swap" rel="stylesheet"></link>

                {/* font-family: "Palanquin Dark", sans-serif;
                        font-weight: 400;
                        font-style: normal;

                        font-family: "Palanquin Dark", sans-serif;
                        font-weight: 500;
                        font-style: normal;

                        font-family: "Palanquin Dark", sans-serif;
                        font-weight: 600;
                        font-style: normal;

                        font-family: "Palanquin Dark", sans-serif;
                        font-weight: 700;
                        font-style: normal; */}

                <style>{`
                    body {
                        ${doTransparentBackground ? 'background-color: transparent !important;' :
                            'background: radial-gradient(circle, rgba(138,224,255,1) 0%, rgba(45,192,235,0.9951330874146533) 33%, rgba(4,80,155,1) 100%);'}
                        font-family: "Palanquin Dark", sans-serif;
                        font-weight: 700;
                        font-style: normal;
                    }
                `}</style>
            </Helmet>
            <Grid container alignItems={'center'} justifyContent={'center'} style={{ minHeight: '900px', width: '100%', }}>
                <Grid item alignItems={'center'} textAlign={'center'} justifyContent={'center'} style={{ height: '100%', width: '100%' }}>
                    <PassageDisplay content={passageContent} 
                        contentProps={{
                            fontSize: '98%',
                        }}
                        verseProps={{
                            fontSize: '80%',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}