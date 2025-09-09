import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { PassageDisplay } from './PassageDisplay'
import { useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../app/store';
import { BilbleSearchFilterState, PassageContent } from '../biblePassageSearchSlice';
import Logger from '../../../utils/Logger';

interface SearchDisplayProps {}

export const SearchDisplay: React.FC<SearchDisplayProps> = () => {
    const { passageContent } = useAppSelector<RootState, BilbleSearchFilterState>((state) => state.biblePassageSearch);
    const [ sessionContent, setSessionContent ] = useState<PassageContent | null>(null)

    const setupWs = (ws: WebSocket) => {
        let retryWsInterval: NodeJS.Timer | null = null;
        ws.onopen = () => {
            Logger.debug('WebSocketServer has been connected')
            ws.send(JSON.stringify({ sessionId: '123' }))
            if (retryWsInterval) clearInterval(retryWsInterval)
        };
        ws.onmessage = (event) => {
            try {
                Logger.debug('event: ', event)
                if (!event?.data || event.data?.size === 0) return;
                const eventData = JSON.parse(event.data);
                Logger.debug('ws client received: ', eventData)
                setSessionContent(eventData);
            } catch (error) {
                Logger.error('Error parsing ws message', error)
            }
        };
        ws.onerror = async () => {
            Logger.debug('WebSocketServer has been closed')
            retryWsInterval = setInterval(() => {
                Logger.debug('Reconnecting to WebSocketServer...')
                ws.close()
                ws = new WebSocket(process.env.REACT_APP_WS_URL || '');
                setupWs(ws)
            }, 2000);
            if (retryWsInterval) clearInterval(retryWsInterval)
        }
    }


    useEffect(() => {
        let ws = new WebSocket(process.env.REACT_APP_WS_URL || '');
        setupWs(ws)
        const closeWs = (ws: WebSocket) => {
            if (ws.readyState === WebSocket.OPEN) {
                Logger.debug('Closing webSocketClient...')
                ws.close();
            }
        }
        return () => closeWs(ws)
    }, [])

    return (
        <>
            <>
                <Grid item xs={12} className='primary' sx={{ minHeight: '500px', width: '100%', display: { xs: 'none', md: 'block' }, padding: { xs: '0px', md: '24px' } }}>
                    <Grid container alignItems={'center'} justifyContent={'center'} style={{ minHeight: '500px', width: '100%' }}>
                        <Grid item className='tc' sx={{ fontSize: '60%' }}>
                            <PassageDisplay content={passageContent} hidePassage
                                messageTextProps={{
                                    fontSize: 'calc(1.7vw + 1.8vh + 0.5vmin)',
                                }}
                                noPassageDisplay={<span className='f1'>Search a passage</span>}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className='primary' sx={{ minHeight: '50px', width: '100%', display: { xs: 'block', md: 'none' }, padding: { xs: '0px', md: '24px' }  }}>
                    <Grid container alignItems={'center'} justifyContent={'center'} style={{ minHeight: '50px', width: '100%' }}>
                        <Grid item className='tc' sx={{ fontSize: '60%' }}>
                            <PassageDisplay content={passageContent} hidePassage
                                contentProps={{
                                    fontSize: '70%',
                                }}
                                messageTextProps={{
                                    WebkitTextStroke: '0px black',
                                    fontWeight: 'normal',
                                }}
                                noPassageDisplay={<span className='f4'>Search a passage</span>}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </>
            <>
                <Grid item xs={12} className='secondary' sx={{ minHeight: '500px', width: '100%', display: { xs: 'none', md: 'block' }, padding: { xs: '0px', md: '24px' } }}>
                    <Grid container alignItems={'center'} justifyContent={'center'} style={{ minHeight: '500px', width: '100%' }}>
                        <Grid item className='tc' sx={{ fontSize: '60%' }}>
                            <PassageDisplay content={sessionContent}
                                messageTextProps={{
                                    fontSize: 'calc(1.7vw + 1.8vh + 0.5vmin)',
                                }}
                                noPassageDisplay={<span className='f1'>Search a passage</span>}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className='secondary' sx={{ minHeight: '50px', width: '100%', display: { xs: 'block', md: 'none' }, padding: { xs: '0px', md: '24px' }  }}>
                    <Grid container alignItems={'center'} justifyContent={'center'} style={{ minHeight: '50px', width: '100%' }}>
                        <Grid item className='tc' sx={{ fontSize: '60%' }}>
                            <PassageDisplay content={sessionContent}
                                contentProps={{
                                    fontSize: '70%',
                                }}
                                messageTextProps={{
                                    WebkitTextStroke: '0px black',
                                    fontWeight: 'normal',
                                }}
                                noPassageDisplay={<span className='f4'>Search a passage</span>}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </>
        </>
    )
}

export default SearchDisplay