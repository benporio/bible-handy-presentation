import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft, faCaretRight, faClockRotateLeft, faCloudArrowUp, faFloppyDisk, faMagnifyingGlass, faMagnifyingGlassArrowRight, faNoteSticky, faSpinner } from '@fortawesome/free-solid-svg-icons';
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
        goToPreviousVerse,
        goToNextVerse,
        doTypeVerse,
    } = useSearchControl();

    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        toggleSearchAndLive(event.target.checked);
    }

    return (
        <Grid item xs={12} style={{  width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={1} alignItems={'center'} justifyContent={'center'}>
                <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
                    <FormControlLabel control={<Checkbox value={!!bhpUser?.doSearchAndLive} onChange={handleCheckbox} color='primary' />} label="Live Search" title='Search and broadcast the result' />
                </Grid>
                { bhpUser?.doSearchAndLive ? 
                    <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
                        <Button onClick={() => doFetchPassage({ broadcast: true, byPassageContent: doTypeVerse })} color='secondary' variant='text' size='small' autoFocus={false} title='Search and broadcast the result'>
                            <span className='b f4'>{isSearchingPassage ? <FontAwesomeIcon icon={faSpinner} spin />  : <FontAwesomeIcon icon={faMagnifyingGlassArrowRight} size='xl' />}</span>
                        </Button>
                    </Grid>
                    :
                    <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
                        <Grid container rowSpacing={3} columnSpacing={1} alignItems={'center'} justifyContent={'center'}>
                            <Grid item md={'auto'} lg={'auto'}>
                                <Button onClick={() => doFetchPassage({ byPassageContent: doTypeVerse })} color='primary' variant='text' sx={{ xs: {} }} size='small' autoFocus={false} title=''>
                                    <span className='b f4'>{isSearchingPassage ? <FontAwesomeIcon icon={faSpinner} spin />  : <FontAwesomeIcon icon={faMagnifyingGlass} size='xl' />}</span>
                                </Button>
                            </Grid>
                            <Grid item md={'auto'} lg={'auto'}>
                                <Button onClick={doBroadcastPassage} { ...getLiveDisableProps() } color='secondary' variant='text' size='small' autoFocus={false} title='Broadcast the result'>
                                    <span className='b f4'>{isBroadcastingPassage ? <FontAwesomeIcon icon={faSpinner} spin />  : <FontAwesomeIcon icon={faCloudArrowUp} size='xl' />}</span>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                <Grid item xs={'auto'} md={'auto'} lg={'auto'} sx={{ marginLeft: { xs: 'none', md: 'auto' } }}>
                    <Grid container rowSpacing={3} alignItems={'center'} justifyContent={'center'}>
                        <Grid item md={'auto'} lg={'auto'}>
                            <Button onClick={goToPreviousVerse} { ...getLiveDisableProps() } color='primary' variant='text' size='small' autoFocus={false} title='Go to previous verse'>
                                <span className='b f4'><FontAwesomeIcon icon={faCaretLeft} size='xl' /></span>
                            </Button>
                            <PresetDrawer />
                        </Grid>
                        <Grid item md={'auto'} lg={'auto'}>
                            <Button onClick={goToNextVerse} { ...getLiveDisableProps() }  color='primary' variant='text' size='small' autoFocus={false} title='Go to next verse'>
                                <span className='b f4'><FontAwesomeIcon icon={faCaretRight} size='xl' /></span>
                            </Button>
                            <HistoryDrawer />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={'auto'} md={'auto'} lg={'auto'} sx={{ marginLeft: { xs: 'none', md: 'auto' } }}>
                    <Grid container rowSpacing={3} columnSpacing={1} alignItems={'center'} justifyContent={'center'}>
                        <Grid item md={'auto'} lg={'auto'} marginLeft={'auto'}>
                            <Button onClick={doSavePassagePreset} { ...getLiveDisableProps() } color='secondary' variant='text' size='small' autoFocus={false} title='Save the current passage as a preset'>
                                <span className='b f4'>{isSavingPreset ? <FontAwesomeIcon icon={faSpinner} spin />  : <FontAwesomeIcon icon={faFloppyDisk} size='xl' />}</span>
                            </Button>
                        </Grid>
                        <Grid item md={'auto'} lg={'auto'} marginLeft={'auto'}>
                            <Button onClick={() => togglePresetDrawer(true)} color='primary' variant='text' size='small' autoFocus={false} title='Show presets'>
                                <span className='b f4'><FontAwesomeIcon icon={faNoteSticky} size='xl' /></span>
                            </Button>
                            <PresetDrawer />
                        </Grid>
                        <Grid item md={'auto'} lg={'auto'} marginLeft={'auto'}>
                            <Button onClick={() => toggleHistoryDrawer(true)}  color='primary' variant='text' size='small' autoFocus={false} title='Show history'>
                                <span className='b f4'><FontAwesomeIcon icon={faClockRotateLeft} size='xl' /></span>
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