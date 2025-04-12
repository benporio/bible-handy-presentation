import { Grid, Autocomplete, TextField } from '@mui/material'
import React, {  } from 'react'
import { BibleVersion, BibleBook } from '../../biblePassageSearchSlice'
import { useSearchControl } from './useSearchControl'

interface SearchInputProps {}

export const SearchInput: React.FC<SearchInputProps> = () => {
    const {
        books,
        versions,
        book,
        version,
        handleBookChange,
        handleVersionChange,
        handleChapterChange,
        handleVerseChange,
        keyDown
    } = useSearchControl(); 

    return (
        <Grid item xs={12} style={{  width: '100%' }}>
            <Grid container rowSpacing={3} columnSpacing={3} alignItems={'center'} justifyContent={'center'}>
                <Grid item md={'auto'} lg={'auto'} xl={4}>
                    <Autocomplete
                        getOptionLabel={(option: BibleVersion) => option.name}
                        onChange={(event, value) => handleVersionChange(value)}
                        disablePortal
                        color='primary'
                        options={versions}
                        sx={{ width: 300 }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    onKeyDown={(event) => keyDown(event)}
                                    variant='outlined'
                                    label='Version'
                                    type='text'
                                    color='primary'
                                    fullWidth
                                    inputProps={{
                                        ...params.inputProps,
                                        style: { height: '100%' }
                                    }}
                                />
                            )
                        }}
                    />
                    
                </Grid>
                <Grid item xs={'auto'} md={'auto'} lg={'auto'} xl={4}>
                    <Autocomplete
                        getOptionLabel={(option: BibleBook) => option?.languages[version?.language || ''] || option.name}
                        onChange={(event, value) => handleBookChange(value)}
                        disabled={!version}
                        disablePortal
                        color='primary'
                        options={books}
                        sx={{ width: 300 }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    onKeyDown={(event) => keyDown(event)}
                                    variant='outlined'
                                    label='Book'
                                    type='text'
                                    color='primary'
                                    fullWidth
                                    inputProps={{
                                        ...params.inputProps,
                                        style: { height: '100%' }
                                    }}
                                />
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={4} lg={2}>
                    <TextField
                        onChange={(event) => handleChapterChange(parseInt((event.target as HTMLInputElement).value))}
                        onKeyDown={(event) => keyDown(event)}
                        disabled={!version}
                        variant='outlined'
                        label='Chapter'
                        type='number'
                        color='primary'
                        fullWidth
                        inputProps={{
                            style: { height: '100%' },
                            min: 1,
                            max: book?.numberOfChapters || 1
                        }}
                    />
                </Grid>
                <Grid item xs={4} lg={2}>
                    <TextField
                        onChange={(event) => handleVerseChange((event.target as HTMLInputElement).value)}
                        onKeyDown={(event) => keyDown(event)}
                        disabled={!version}
                        variant='outlined'
                        label='Verse(s)'
                        placeholder='1, 2, 3-5'
                        type='text'
                        color='primary'
                        fullWidth
                        inputProps={{
                            style: { height: '100%' },
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SearchInput