import { Container, Grid } from '@mui/material';
import React, {  } from 'react';
import { Helmet } from 'react-helmet-async';
import Logger from '../../utils/Logger';
import SearchInput from '../../features/biblePassageSearch/components/SearchControl/SearchInput';
import SearchDisplay from '../../features/biblePassageSearch/components/SearchDisplay';
import SearchButton from '../../features/biblePassageSearch/components/SearchControl/SearchButton';

interface HomeProps { }

export const Home: React.FC<HomeProps> = () => {

    Logger.debug('rendering Home...')
    return (
        <Container sx={{ width: { xs: '100%', md: '80%' } }}>
            <Helmet>
                <title>BHP | Home</title>
            </Helmet>
            <Grid container rowGap={4} justifyContent={'center'} alignItems={'center'} direction={'row'}>
                <SearchInput />
                <SearchButton />
                <SearchDisplay />
            </Grid>
        </Container>
    );
}