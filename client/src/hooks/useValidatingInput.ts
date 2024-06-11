import { useState, ChangeEvent, ChangeEventHandler, useEffect } from 'react';
import { appDispatch } from '../app/hooks';
import { InputState } from '../features/auth/authSlice';

export type DebounceValdationType = {
    validationCall: (value: string) => void
    delay: number
}

const defaultProps = {
    defaultErrorHelperText: 'Invalid value',
    noErrorHelperText: ' ',
    validation: (value: string) => !!value, 
    parseReturnProps: (returnProps: ReturnProps) => returnProps,
    successCallback: () => null,
    failedCallback: () => null,
    changeCallback: (value?: string, field?: string, isError?: boolean) => null,
}

type InputOptions = {
    inputState: InputState
    defaultErrorHelperText?: string
    updateFormState: <T>(payload: T) => {
        payload: T;
        type: string;
    }
}

export type ValidationOptions = {
    field?: string
    validation?: (value: string) => boolean
    parseReturnProps?: <T>(returnProps: ReturnProps) => T
    successCallback?: () => void
    failedCallback?: () => void
    changeCallback?: (value?: string, field?: string, isError?: boolean) => void
}

export type ReturnProps = {
    formInputState: InputState
    setFormInputState: React.Dispatch<React.SetStateAction<InputState>>
    isError: boolean
    helperText: string
    handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export function useValidatingInput<T>(inputOpt: InputOptions, validateOpt? : ValidationOptions): ReturnProps | T {
    const { 
        inputState, 
        defaultErrorHelperText = defaultProps.defaultErrorHelperText,
        updateFormState,
    } = inputOpt as InputOptions;
    const { 
        field,
        validation = defaultProps.validation, 
        parseReturnProps = defaultProps.parseReturnProps,
        successCallback = defaultProps.successCallback,
        failedCallback = defaultProps.failedCallback,
        changeCallback = defaultProps.changeCallback,
    } = validateOpt as ValidationOptions;
    const [formInputState, setFormInputState] = useState(inputState);
    const [isError, setError] = useState<boolean>(false);
    const [errorHelperText, setErrorHelperText] = useState(defaultProps.noErrorHelperText);

    useEffect(() => {
        if (inputState.isValid !== undefined) {
            setError(!inputState.isValid)
        }
    }, [inputState])

    const dispatch = appDispatch()

    const validatingFunc = (bool: boolean) => {
        setError(!bool)
        if (bool) {
            setErrorHelperText(defaultProps.noErrorHelperText)
            successCallback()
        } else {
            setErrorHelperText(defaultErrorHelperText)
            failedCallback()
        }
    }
    const returnProps: ReturnProps = {
        formInputState,
        setFormInputState,
        isError,
        helperText: errorHelperText,
        handleChange: function(e: ChangeEvent<HTMLInputElement>) {
            const newValue: string = e.target.value
            const isValid: boolean = validation(newValue)
            dispatch(updateFormState({
                ...formInputState,
                value: e.target.value,
                isValid: isValid,
            }));
            validatingFunc(isValid)
            changeCallback(newValue, field, isError)
        }
    }
    return parseReturnProps(returnProps)
}