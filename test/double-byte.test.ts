import {DoubleByte} from '../src/double-byte';

describe('constructor', () => {
    // TODO
    it('number', () => {
        const dByte: DoubleByte = DoubleByte.OF(0xFFFF);
        expect(dByte.hi.getBit(5).val()).toBe(1);
    });
});
