import { createTheme } from "@mui/material/styles";

export const commonTheme = createTheme({
    palette: {
        text: {
            primary: '#FCFCFC'
        },
        background: {
            default: '#101418',
        },
        primary: {
            // main: '#DDFFF7'
            main: '#FCFCFC'
        },
        secondary: {
            main: '#93E1D8'
        },
        info: {
            main: '#FFA69E'
        },
    },
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#343434',
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "&:focus": {
                        color: '#343434',
                        borderColor: '#0094FF',
                    },
                    backgroundColor: '#030E16',
                    textAlign: 'center',
                },
                notchedOutline: {
                    borderColor: '#0094FF',
                }
            }
        }
    }
});