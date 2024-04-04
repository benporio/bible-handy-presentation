import { useState, ChangeEvent, ChangeEventHandler } from 'react';

const defaultProps = {
    initialValue: '',
    defaultErrorHelperText: 'Invalid value',
    noErrorHelperText: ' ',
    validation: (value: string) => !!value, 
    parseReturnProps: (returnProps: ReturnProps) => returnProps,
    successCallback: () => null,
    failedCallback: () => null,
    changeCallback: () => null,
}

type InputOptions = {
    initialValue?: string
    defaultErrorHelperText?: string
}

type ValidationOptions = {
    validation?: (value: string) => boolean
    parseReturnProps?: <T>(returnProps: ReturnProps) => T
    successCallback?: () => void
    failedCallback?: () => void
    changeCallback?: () => void
}

export type ReturnProps = {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    isError: boolean
    helperText: string
    handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export function useValidatingInput<T>(inputOpt: InputOptions, validateOpt? : ValidationOptions): ReturnProps | T {
    const { 
        initialValue = defaultProps.initialValue, 
        defaultErrorHelperText = defaultProps.defaultErrorHelperText
    } = inputOpt as InputOptions;
    const { 
        validation = defaultProps.validation, 
        parseReturnProps = defaultProps.parseReturnProps,
        successCallback = defaultProps.successCallback,
        failedCallback = defaultProps.failedCallback,
        changeCallback = defaultProps.changeCallback,
    } = validateOpt as ValidationOptions;
    const [value, setValue] = useState(initialValue);
    const [isError, setError] = useState<boolean>(false);
    const [errorHelperText, setErrorHelperText] = useState(defaultProps.noErrorHelperText);
    const returnProps: ReturnProps = {
        value,
        setValue,
        isError,
        helperText: errorHelperText,
        handleChange: function(e: ChangeEvent<HTMLInputElement>) {
            const newValue: string = e.target.value
            setValue(newValue);
            if (validation(newValue)) {
                setError(false)
                setErrorHelperText(defaultProps.noErrorHelperText)
                successCallback()
            } else {
                setError(true)
                setErrorHelperText(defaultErrorHelperText)
                failedCallback()
            }
            changeCallback()
        }
    }
    return parseReturnProps(returnProps)
}