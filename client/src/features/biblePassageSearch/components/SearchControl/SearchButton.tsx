import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Grid, Button, Checkbox, FormControlLabel } from '@mui/material'
import { useSearchControl } from './useSearchControl'
import PresetDrawer from './PresetDrawer';
import HistoryDrawer from './HistoryDrawer';

interface SearchButtonProps {}

export const SearchButton: React.FC<SearchButtonProps> = () => {
    const { 
        doFetchPassage, 
        isSearchingPassage,
        doBroadcastPassage,
        isBroadcastingPassage,
        getLiveDisableProps,
        togglePresetDrawer,
        toggleHistoryDrawer,
        doSavePassagePreset,
        toggleSearchAndLive,
        isSavingPreset,
        bhpUser,
    } = useSearchControl();

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        toggleSearchAndLive(event.target.checked);
    }

    return (
        <Grid item xs={12} style={{  width: '100%' }}>
            <Grid container rowSpacing={2} columnSpacing={2} alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
                    <FormControlLabel control={<Checkbox value={!!bhpUser?.doSearchAndLive} onChange={handleCheckbox} color='primary' />} label="Search and Live" />
                </Grid>
                { bhpUser?.doSearchAndLive ? 
                    <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
                        <Button onClick={() => doFetchPassage(true)} color='secondary' variant='contained' size='small' autoFocus={false}>
                            <span className='b f4'>{isSearchingPassage ? <FontAwesomeIcon icon={faSpinner} spin />  : 'SEARCH'}</span>
                        </Button>
                    </Grid>
                    :
                    <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
                        <Grid container rowSpacing={3} columnSpacing={2} alignItems={'center'} justifyContent={'center'}>
                            <Grid item md={'auto'} lg={'auto'}>
                                <Button onClick={() => doFetchPassage()} color='primary' variant='contained' sx={{ xs: {} }} size='small' autoFocus={false}>
                                    <span className='b f4'>{isSearchingPassage ? <FontAwesomeIcon icon={faSpinner} spin />  : 'SEARCH'}</span>
                                </Button>
                            </Grid>
                            <Grid item md={'auto'} lg={'auto'}>
                                <Button onClick={doBroadcastPassage} { ...getLiveDisableProps() } color='secondary' variant='contained' size='small' autoFocus={false}>
                                    <span className='b f4'>{isBroadcastingPassage ? <FontAwesomeIcon icon={faSpinner} spin />  : 'LIVE'}</span>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                <Grid item xs={'auto'} md={'auto'} lg={'auto'} sx={{ marginLeft: { xs: 'none', md: 'auto' } }}>
                    <Grid container rowSpacing={3} columnSpacing={2} alignItems={'center'} justifyContent={'center'}>
                        <Grid item md={'auto'} lg={'auto'} marginLeft={'auto'}>
                            <Button onClick={doSavePassagePreset} { ...getLiveDisableProps() } color='secondary' variant='outlined' size='small' autoFocus={false}>
                                <span className='b f4'>{isSavingPreset ? <FontAwesomeIcon icon={faSpinner} spin />  : 'SAVE'}</span>
                            </Button>
                        </Grid>
                        <Grid item md={'auto'} lg={'auto'} marginLeft={'auto'}>
                            <Button onClick={() => togglePresetDrawer(true)} color='primary' variant='outlined' size='small' autoFocus={false}>
                                <span className='b f4'>PRESET</span>
                            </Button>
                            <PresetDrawer />
                        </Grid>
                        <Grid item md={'auto'} lg={'auto'} marginLeft={'auto'}>
                            <Button onClick={() => toggleHistoryDrawer(true)}  color='primary' variant='outlined' size='small' autoFocus={false}>
                                <span className='b f4'>HISTORY</span>
                            </Button>
                            <HistoryDrawer />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SearchButton