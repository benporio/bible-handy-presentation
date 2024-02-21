import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { CommonComponentProp } from '../../../types/Component'
import { InputBoxStyle } from '../../../themes/darkTheme'

interface InputBoxProps extends CommonComponentProp {
    type?: React.HTMLInputTypeAttribute
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    label: string
    autoFocus?: boolean
    error?: boolean
    helperText?: string
    validators?: Array<(val: string) => boolean>
    invalidHelperText?: string
}

export const InputBox: React.FC<InputBoxProps> = ({
    type,
    onChange,
    id,
    key,
    style,
    className,
    label,
    autoFocus,
    error,
    helperText,
    validators,
    invalidHelperText,
}) => {
    const [ isValid, setValid ] = useState<boolean>(true);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (onChange) onChange(e);
        if (validators?.length && e.target.value) {
            let isValidValue: boolean = true;
            for (const validator of validators) {
                if (!validator(e.target.value)) {
                    isValidValue = false;
                    break;
                }
            }
            setValid(isValidValue);
        } else {
            setValid(true);
        }
    }
    return (
        <div>
            <TextField
                autoFocus={autoFocus ? autoFocus : false}
                margin="dense"
                id={id}
                key={key}
                label={label}
                InputLabelProps={{}}
                type={type ? type : 'text'}
                fullWidth
                inputProps={{
                    style: { height: '100%' }
                }}
                style={{ ...InputBoxStyle.style, ...style }}
                className={`${InputBoxStyle.className} ${className ? `${className}` : ''}`}
                onChange={(e) => handleChange(e)}
                error={error || !isValid}
                helperText={helperText ? helperText : (invalidHelperText ? invalidHelperText : '')}
            />
        </div>
    );
}