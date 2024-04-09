import PromiseUtil from '../../src/utils/PromiseUtil';

type TestType = {
    data: string
}

const testOutput: TestType = {
    data: 'test'
}

describe('PromiseUtil.createPromise', () => {
    it('should resolve correct value', async () => {
        const result = await PromiseUtil.createPromise<TestType>((resolve, reject) => {
            resolve({
                data: 'test'
            })
        })
        expect(result).toEqual(testOutput);
    });

    it('should reject an error', async () => {
        try {
            await PromiseUtil.createPromise<TestType>((resolve, reject) => {
                try {
                    throw new Error('test error')
                } catch (error: any) {
                    reject(error)
                }
            })
        } catch (error) {
            expect(error).toHaveProperty('message', 'test error');
        }
    });
});