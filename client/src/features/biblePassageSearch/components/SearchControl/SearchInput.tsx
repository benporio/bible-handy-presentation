import { Grid, Autocomplete, TextField, FormControlLabel, Switch } from '@mui/material'
import React, {  } from 'react'
import { BibleVersion, BibleBook, Passage } from '../../biblePassageSearchSlice'
import { useSearchControl } from './useSearchControl'

interface SearchInputProps {}

export const SearchInput: React.FC<SearchInputProps> = () => {
    const {
        books,
        versions,
        book,
        version,
        doTypeVerse,
        handleBookChange,
        handleVersionChange,
        handleChapterChange,
        handleVerseChange,
        keyDown,
        handleTypeVerseChange,
        handleTypePassageChange,
        typePassageSuggestions,
        handleTypePassageSelection,
    } = useSearchControl(); 

    return (
        <Grid item xs={12} style={{  width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={1} alignItems={'center'} justifyContent={'space-between'}>
                <Grid item xs={12} md={3} lg={3}>
                    <Autocomplete
                        getOptionLabel={(option: BibleVersion) => option.name}
                        onChange={(event, value) => handleVersionChange(value)}
                        disablePortal
                        color='primary'
                        options={versions}
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
                <FormControlLabel
                    onChange={(event) => handleTypeVerseChange((event.target as HTMLInputElement).checked)}
                    sx={{ verticalAlign: 'middle', margin: 'auto', marginTop: 2 }}
                    control={<Switch color="primary" />}
                    label="Type passage"
                    value="doTypeVerse"
                    labelPlacement="top"
                    disabled={!version}
                />
                { doTypeVerse ? (
                    <Grid item xs={12} md={7} lg={7}>
                        <Autocomplete
                            getOptionLabel={(option: Passage) => option.description || ''}
                            onChange={(event, value) => handleTypePassageSelection(value)}
                            disablePortal
                            color='primary'
                            options={typePassageSuggestions}
                            filterOptions={(typePassageSuggestions, state) => typePassageSuggestions}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        onChange={(event) => handleTypePassageChange((event.target as HTMLInputElement).value)}
                                        disabled={!version}
                                        variant='outlined'
                                        label='Passage'
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
                ) : (
                    <>
                        <Grid item xs={7} md={3} lg={3}>
                            <Autocomplete
                                getOptionLabel={(option: BibleBook) => option?.languages[version?.language || ''] || option.name}
                                onChange={(event, value) => handleBookChange(value)}
                                disabled={!version}
                                disablePortal
                                color='primary'
                                options={books}
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
                        <Grid item xs={6} md={2} lg={2}>
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
                        <Grid item xs={6} md={2} lg={'auto'}>
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
                    </>
                )}
            </Grid>
        </Grid>
    )
}

export default SearchInput