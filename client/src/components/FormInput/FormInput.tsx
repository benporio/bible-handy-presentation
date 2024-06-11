import React from 'react';
import { ValidationOptions } from '../../hooks/useValidatingInput';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { InputBaseComponentProps } from '@mui/material';
import { useFormInput } from './useFormInput';
import { InputState } from '../../features/auth/authSlice';

export interface FormInputProps { 
    label: string
    inputState: InputState
    defaultErrorHelperText?: string
    validationOpt?: ValidationOptions
    textFieldProps?: Omit<TextFieldProps, 'variant'>
    inputBaseProps?: InputBaseComponentProps
    autoComplete?: string
    updateFormState: <T>(payload: T) => {
        payload: T;
        type: string;
    }
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    inputState,
    defaultErrorHelperText,
    validationOpt,
    textFieldProps,
    inputBaseProps,
    autoComplete = 'on',
    updateFormState,
}) => {
    const formInput = useFormInput({
        inputState,
        defaultErrorHelperText,
        validationOpt,
        textFieldProps,
        inputBaseProps,
        updateFormState,
    });
    return (
        <TextField
            label={label}
            { ...formInput.textFieldProps as Omit<TextFieldProps, 'variant'> }
            inputProps={{
                ...formInput.inputBaseProps as InputBaseComponentProps,
                name: inputState.name,
                autoComplete: autoComplete,
            }}
            { ...formInput.inputValidationProps }
        />
    );
}