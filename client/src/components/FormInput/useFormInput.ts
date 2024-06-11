import { ChangeEventHandler } from 'react';
import { ValidationOptions, useValidatingInput } from '../../hooks/useValidatingInput';
import { TextFieldProps } from '@mui/material/TextField';
import { InputBaseComponentProps } from '@mui/material';
import { InputState } from '../../features/auth/authSlice';

type ValidationProps = {
    error: boolean
    helperText: string
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export const useFormInput = (hookProps: {
    inputState: InputState
    defaultErrorHelperText?: string
    validationOpt?: ValidationOptions
    textFieldProps?: Omit<TextFieldProps, 'variant'>, 
    inputBaseProps?: InputBaseComponentProps
    updateFormState: <T>(payload: T) => {
        payload: T;
        type: string;
    }
}) => {
    const {
        inputState,
        defaultErrorHelperText,
        validationOpt,
        textFieldProps,
        inputBaseProps,
        updateFormState,
    } = hookProps
    const defaults = {
        textFieldProps: {
            margin: 'dense',
            type: 'text',
            fullWidth: true,
            ...textFieldProps
        },
        inputBaseProps: {
            style: { height: '100%' },
            ...inputBaseProps
        }
    }
    const inputValidation: ValidationProps = useValidatingInput<ValidationProps>(
        { inputState,  defaultErrorHelperText, updateFormState }, validationOpt
    ) as ValidationProps
    const parseInputProps = ({error, helperText, onChange}: ValidationProps): ValidationProps => {
        return {error, helperText, onChange}
    }
    return {
        textFieldProps: defaults.textFieldProps,
        inputBaseProps: defaults.inputBaseProps,
        inputValidationProps: parseInputProps(inputValidation)
    }
}