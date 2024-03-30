export default class TypeUtil {
    public static keys<T>(o: { new (): T }) {
        return Object.keys(o) as Array<keyof T>;
    }
}