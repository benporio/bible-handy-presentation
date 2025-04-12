import { createTheme } from "@mui/material/styles";

const PALETTE = {
    text: {
        primary: '#FCFCFC'
    },
    background: {
        default: '#101418',
        grid: '#060E0F',
    },
    primary: {
        main: '#0094FF',
        light: '#5fb9fa',
        dark: '#0248a3',
        contrastText: '#0A141B',
    },
    secondary: {
        main: '#00A789',
        light: '#00D387',
        dark: '#007040',
        contrastText: '#0A141B',
    },
    error: {
        main: '#A0153E',
        light: '#FF204E',
        dark: '#5D0E41',
        contrastText: '#0A141B',
    },
    success: {
        main: '#82CD47',
        light: '#BFEA7C',
        dark: '#416D19',
        contrastText: '#0A141B',
    },
};

export const commonTheme = createTheme({
    palette: PALETTE,
    components: {
        MuiGrid: {
            variants: [
                {
                    props: { className: 'primary' },
                    style: {
                        border: `1px solid ${PALETTE.primary.light}`,
                        backgroundColor: PALETTE.background.grid,
                        borderRadius: 16,
                    },
                },
                {
                    props: { className: 'secondary' },
                    style: {
                        border: `1px solid ${PALETTE.secondary.light}`,
                        backgroundColor: PALETTE.background.grid,
                        borderRadius: 16,
                    },
                },
            ],
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: PALETTE.text.primary,
                },
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 11,
                    color: PALETTE.text.primary,
                },
                notchedOutline: {
                    variants: [
                        {
                            props: { color: 'primary' },
                            style: {
                                border: `1px solid ${PALETTE.primary.main}`,
                                color: PALETTE.primary.main,
                            },
                        },
                        {
                            props: { color: 'secondary' },
                            style: {
                                border: `1px solid ${PALETTE.secondary.main}`,
                                color: PALETTE.secondary.main,
                            },
                        },
                    ],
                }
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    borderRadius: 11,
                    backgroundColor: PALETTE.background.default,
                    color: PALETTE.text.primary,
                    variants: [
                        {
                            props: { color: 'primary' },
                            style: {
                                border: `1px solid ${PALETTE.primary.main}`,
                            },
                        },
                        {
                            props: { color: 'secondary' },
                            style: {
                                border: `1px solid ${PALETTE.secondary.main}`,
                            },
                        },
                    ],
                },
                popupIndicator: {
                    color: PALETTE.primary.main,
                },
                clearIndicator: {
                    color: PALETTE.primary.main,
                },
                endAdornment: {
                    color: PALETTE.primary.main,
                },
                option: {
                    '&.MuiAutocomplete-option:hover': {
                        background: PALETTE.primary.dark,
                    },
                }
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 11,
                }, 
            },
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        border: `1px solid ${PALETTE.primary.main}`,
                    },
                    
                },
                {
                    props: { variant: 'contained', color: 'primary', className: 'disabled' },
                    style: {
                        "&.Mui-disabled": {
                            background: PALETTE.primary.dark,
                            color: PALETTE.primary.light,
                        }
                    },
                    
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        border: `1px solid ${PALETTE.secondary.light}`,
                    },
                },
                {
                    props: { variant: 'contained', color: 'secondary', className: 'disabled' },
                    style: {
                        "&.Mui-disabled": {
                            background: PALETTE.secondary.dark,
                            color: PALETTE.secondary.light,
                        }
                    },
                    
                },
            ],
        },
        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                    fontWeight: 'bolder'
                }, 
            },
            variants: [
                {
                    props: { className: 'success' },
                    style: {
                        backgroundColor: PALETTE.success.main,
                    },
                },
                {
                    props: { className: 'error' },
                    style: {
                        backgroundColor: PALETTE.error.light,
                    },
                },
            ],
        },
        MuiCheckbox: {
            variants: [
                {
                    props: { color: 'primary' },
                    style: {
                        color: PALETTE.primary.main,
                    },
                },
                {
                    props: { color: 'secondary' },
                    style: {
                        color: PALETTE.secondary.main,
                    },
                },
            ],
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: PALETTE.background.default,
                    color: PALETTE.text.primary,
                },
            },
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    backgroundColor: PALETTE.background.default,
                    color: PALETTE.text.primary,
                    fontWeight: 'bolder',
                    fontSize: '1.2rem',
                },
            },
        },
    }
});