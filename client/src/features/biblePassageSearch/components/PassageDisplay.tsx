import React, { ReactElement } from 'react'
import { Grid } from '@mui/material';
import { PassageContent } from '../biblePassageSearchSlice';
import Logger from '../../../utils/Logger';

interface PassageDisplayProps { 
    content: PassageContent | null
    hidePassage?: boolean
    messageTextProps?: React.CSSProperties
    verseProps?: React.CSSProperties
    contentProps?: React.CSSProperties
    noPassageDisplay?: ReactElement
}

export const PassageDisplay: React.FC<PassageDisplayProps> = ({ content: passageContent, hidePassage, messageTextProps, verseProps, noPassageDisplay = <></>, contentProps }) => {
    const renderPassageContent = (passageContent: PassageContent | null): ReactElement => {
        let hasValidPassage = true;
        if (!!!passageContent?.message) hasValidPassage = false;
        const { passage, parts } = passageContent || {};
        const verses = passage?.verses || [];
        if (verses.length === 0 || !!!parts) hasValidPassage = false;
        if (hasValidPassage) {
            Logger.debug('parts: ', parts)
            return (
                <Grid className='messageText'
                    style={{ 
                        margin: '10px',
                        color: 'white',
                        fontSize: 'calc(1.8vw + 1.8vh + 1.2vmin)',
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)', // Added blur effect
                        fontWeight: 'bold',
                        WebkitTextStroke: '2px black',
                        ...messageTextProps
                    }}>
                    <div className='content'
                    style={{
                        fontSize: '72%',
                        lineHeight: '125%',
                        ...contentProps
                    }}>
                        {parts?.map((part) => {
                            if (part.className.includes('label')) {
                                return (
                                    <sup className='label' key={part.id}
                                    style={{
                                        fontSize: '65%',
                                        paddingRight: '5px',
                                    }}>
                                        {part.innerText}
                                    </sup>
                                )
                            } else if (part.className.includes('nd')) {
                                return (
                                    <span className='nd' key={part.id}
                                    style={{
                                        fontVariant: 'small-caps',
                                        fontSize: '120%',
                                    }}>
                                        {part.innerText}
                                    </span>
                                )
                            } else if (part.className.includes('add')) {
                                return <em key={part.id}>{part.innerText}</em>
                            }
                            return <span key={part.id}>{part.innerText.search('.') > 0 ? part.innerText : part.innerText.concat(' ')}</span>;
                        })}
                    </div>
                    {hidePassage ? <></> : 
                        <div className='verse' 
                            style={{
                                fontSize: '60%',
                                lineHeight: '270%',
                                ...verseProps
                            }}>
                            {passage?.description}
                        </div>
                    }
                </Grid>
            )
        }
        return noPassageDisplay
    }

    return renderPassageContent(passageContent);
}
