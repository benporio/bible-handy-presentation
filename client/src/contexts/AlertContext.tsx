import { createContext, useContext, useState, Fragment } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export type AlertType = 'info' | 'error' | 'success'

interface AlertContextInterface {
    showAlert: (message: string, type?: AlertType) => void
    closeAlert: () => void
}

const AlertContext = createContext<AlertContextInterface | undefined>(undefined);

export const useAlertContext = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error("useAlertContext must be used within a AlertProvider");
    }
    return context;
};

interface AlertProviderProps {
    children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('info');

    const showAlert = (message: string, type?: AlertType) => {
        setMessage(message)
        !!type && setType(type)
        setOpen(true)
    }

    const closeAlert = () => setOpen(false);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const snackbarProps = {
        className: 'primary'
    }
    
    switch (type) {
        case 'error':
            snackbarProps.className = 'error'
            break;
        case 'success':
            snackbarProps.className = 'success'
            break;
        default:
            break;
    }

    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={action}
                ContentProps={{ ...snackbarProps }}
            />
        </AlertContext.Provider>
    );
};

export default AlertContext;