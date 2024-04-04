class StringUtil {
    public isValidString(string: string, regex: RegExp): boolean {
        if (regex.test(string)) return true
        return false;
    }
}

export default (new StringUtil()) as StringUtil