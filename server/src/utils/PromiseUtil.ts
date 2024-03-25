export type PromiseResolver<T> = (value: T | PromiseLike<T>) => void
export type PromiseRejecter<T> = (reason: T) => void
export type PromiseExecuter<T> = (resolve: PromiseResolver<T>, reject: PromiseRejecter<T>) => void
export type PromiseErrorHandler<T> = (resolve: PromiseResolver<T>, reject: PromiseRejecter<T>) => (error: any) => void

export default class PromiseUtil {
    public static async createPromise<T>(executer: PromiseExecuter<T>): Promise<T> {
        return await (async(executer: PromiseExecuter<T>): Promise<T> => {
            return new Promise<T>((resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => {
                executer(resolve, reject);
            });
        })(executer);
    }
}