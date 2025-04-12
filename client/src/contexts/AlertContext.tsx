import { createContext, useContext, useState, Fragment, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AppMessage } from '../types/Error';

export type AlertType = 'info' | 'error' | 'success'

export type AlertErrorMessage = {
    message: string | string[] | AppMessage[]
}

interface AlertContextInterface {
    showAlert: (message: string, type?: AlertType) => void
    closeAlert: () => void
    showAlertError: (error: AlertErrorMessage) => void
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

    const showAlertError = (error: AlertErrorMessage) => {
        const alertInfo: { message: string, type: AlertType } = {
            message: 'Something went wrong',
            type: 'error',
        }
        if (typeof error.message === 'string') {
            alertInfo.message = error.message
        } else if (!!error.message && !!error.message.length) {
            const messages: string[] = (error.message as AppMessage[]).map(m => m.message)
            alertInfo.message = messages.join(', ')
        }
        showAlert(alertInfo.message, alertInfo.type)
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

    const value = useMemo(
        () => ({ showAlert, closeAlert, showAlertError }),
        []
    )

    return (
        <AlertContext.Provider value={value}>
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