import { useState, ChangeEvent, ChangeEventHandler } from 'react';

type InputOptions = {
    initialValue?: string
    defaultErrorHelperText?: string
}

type ValidationOptions = {
    validation?: (value: string) => boolean
    parseReturnProps?: <T>(returnProps: ReturnProps) => T
}

export type ReturnProps = {
    value: string
    isError: boolean
    helperText: string
    handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export function useValidatingInput<T>(inputOpt: InputOptions, validateOpt? : ValidationOptions): ReturnProps | T {
    const { initialValue, defaultErrorHelperText } = inputOpt as InputOptions;
    const { validation, parseReturnProps } = validateOpt as ValidationOptions;
    const [value, setValue] = useState(initialValue || '');
    const [isError, setError] = useState<boolean>(false);
    const [errorHelperText, setErrorHelperText] = useState('');
    const returnProps: ReturnProps = {
        value: value,
        isError: isError,
        helperText: errorHelperText,
        handleChange: function(e: ChangeEvent<HTMLInputElement>) {
            const newValue: string = e.target.value
            setValue(newValue);
            if ((!!!validation && !!newValue) || (!!validation && validation(newValue))) {
                setError(false)
                setErrorHelperText('')
            } else {
                setError(true)
                setErrorHelperText(defaultErrorHelperText || 'Invalid value')
            }
        }
    }
    if (!!parseReturnProps) return parseReturnProps(returnProps) as T
    return returnProps;
}