class TimeUtil {
    public timeout(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default (new TimeUtil()) as TimeUtil