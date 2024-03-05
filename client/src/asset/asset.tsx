import React from 'react';
import { ReactComponent as LogoSvg } from './images/logo.svg';
import { ReactComponent as AnonymousProfilePicSvg } from './images/anonymousProfilePic.svg';

interface assetProps extends React.SVGProps<SVGSVGElement> {
    style?: React.CSSProperties
}

export const AppLogo: React.FC<assetProps> = ({
    style
}) => {
    return <LogoSvg style={style} />;
}

export const AnonymousProfilePic: React.FC<assetProps> = ({
    style
}) => {
    return <AnonymousProfilePicSvg style={style} />;
}