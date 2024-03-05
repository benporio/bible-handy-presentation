import { createTheme } from "@mui/material/styles";

const PALETTE = {
    text: {
        primary: '#FCFCFC'
    },
    background: {
        default: '#101418',
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
};

export const commonTheme = createTheme({
    palette: PALETTE,
    components: {
        MuiGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: PALETTE.background.default,
                }, 
            },
            variants: [
                {
                    props: { className: 'primary' },
                    style: {
                        border: `1px solid ${PALETTE.primary.light}`,
                        backgroundColor: '#060E0F',
                        borderRadius: 16,
                    },
                },
                {
                    props: { className: 'secondary' },
                    style: {
                        border: `1px solid ${PALETTE.secondary.light}`,
                        backgroundColor: '#060E0F',
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
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        border: `1px solid ${PALETTE.secondary.light}`,
                    },
                },
            ],
        },
    }
});