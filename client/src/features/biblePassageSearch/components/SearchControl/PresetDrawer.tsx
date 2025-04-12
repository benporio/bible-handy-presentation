import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useSearchControl } from './useSearchControl';
import { ListSubheader } from '@mui/material';

interface PresetDrawerProps { }

export const PresetDrawer: React.FC<PresetDrawerProps> = () => {
    const {
        openPresetDrawer, togglePresetDrawer,
        bhpUser, loadPassagePresetHistory,
    } = useSearchControl();

    const DrawerList = (
        <Box sx={{ width: 250 }} onClick={() => togglePresetDrawer(false)}>
            <List subheader={<ListSubheader id="preset-list-subheader">PRESET</ListSubheader>}>
                {bhpUser && bhpUser.bibleSearchPresets.map(({ title, passageContent }, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => loadPassagePresetHistory(passageContent)}>
                            <ListItemText primary={title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer anchor={'right'} open={openPresetDrawer} onClose={() => togglePresetDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
}

export default PresetDrawer;