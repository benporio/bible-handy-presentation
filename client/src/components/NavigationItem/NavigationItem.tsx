import React from 'react';
import { useTheme } from "@mui/material/styles";

interface NavigationItemProps { 
    selected: boolean
    label: string
    onClick: React.MouseEventHandler<HTMLSpanElement> | undefined
    spanProps?: React.HTMLAttributes<HTMLSpanElement>
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
    selected,
    label,
    onClick,
    spanProps,
}) => {
    const theme = useTheme()
    return (
        <>
            {selected ?
                <>
                    <span style={{ color: '#0094FF', fontWeight: 'bold' }}>{label}</span>
                    <div style={{ borderRadius: 5, boxShadow: '0 0 5px 0px #0094FF', width: '100%', border: '1px solid #0094FF' }}/>
                </>
            : 
                <span { ...spanProps } onClick={onClick} style={{ cursor: 'pointer' }}>{label}</span>
            }
        </>
    );
}