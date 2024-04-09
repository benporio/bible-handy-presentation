import TimeUtil from '../../src/utils/TimeUtil';

describe('TimeUtil.timeout', () => {
    const delay = 4000;
    const acceptedTolerance = 20;
    it(`should timeout for ${delay} ms with accepted tolerance of ${acceptedTolerance} ms`, async () => {
        const start = new Date();
        const timeOut = await TimeUtil.timeout(delay)
        expect((new Date()).getTime() - start.getTime()).toBeLessThanOrEqual(delay + acceptedTolerance);
        clearTimeout(timeOut)
    });
});
