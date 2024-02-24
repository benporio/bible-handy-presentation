import React from 'react';
import { ReactComponent as Logo } from './images/logo.svg';

interface AppLogoProps extends React.SVGProps<SVGSVGElement> {
    style?: React.CSSProperties
}

export const AppLogo: React.FC<AppLogoProps> = ({
    style
}) => {
    return <Logo style={style} />;
}