class TimeUtil {
    public timeout(ms: number): Promise<NodeJS.Timeout> {
        return new Promise(resolve => {
            const timeOut = setTimeout(() => {
                resolve(timeOut)
            }, ms)
        });
    }
}

export default (new TimeUtil()) as TimeUtil