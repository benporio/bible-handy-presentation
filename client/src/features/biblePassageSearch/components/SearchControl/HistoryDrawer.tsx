import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useSearchControl } from './useSearchControl';
import { ListSubheader } from '@mui/material';

interface HistoryDrawerProps { }

export const HistoryDrawer: React.FC<HistoryDrawerProps> = () => {
    const {
        openHistoryDrawer, toggleHistoryDrawer,
        bhpUser, loadPassagePresetHistory,
    } = useSearchControl();

    const DrawerList = (
        <Box sx={{ width: 250 }} onClick={() => toggleHistoryDrawer(false)}>
            <List subheader={<ListSubheader id="history-list-subheader">HISTORY</ListSubheader>}>
                {bhpUser && bhpUser.bibleSearchHistory.map(({ passageContent }, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => loadPassagePresetHistory(passageContent)}>
                            <ListItemText primary={passageContent.passage?.description} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer anchor={'right'} open={openHistoryDrawer} onClose={() => toggleHistoryDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
}

export default HistoryDrawer;