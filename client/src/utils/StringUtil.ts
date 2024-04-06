class StringUtil {
    public isEmailValid(email: string) {
        return this.isValidString(email, new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/))
    }
    public isValidString(string: string, regex: RegExp): boolean {
        if (regex.test(string)) return true
        return false;
    }
}

export default (new StringUtil()) as StringUtil