import {Byte} from '../../src/byte';
import {DoubleByte} from '../../src/double-byte';
import {range} from '../../src/lib/util';
import {Memory} from '../../src/memory';
import {TileSet} from '../../src/video/tile-set';

function createEmptyTestCase(): [TileSet, Memory] {
    const memory: Memory = new Memory();
    const region: DoubleByte[] = range(0, 16).map(i => DoubleByte.OF(i));
    region.forEach(db => memory.setWord(db, Byte.OF(0)));
    return [new TileSet(region), memory];
}

describe('simple static tests', () => {
    it('zeroes stay zeroes', () => {
        const tuple = createEmptyTestCase();
        tuple[0].update(tuple[1]);

        const expected: number[][] = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ];

        expect(tuple[0].getColors()).toEqual(expected);
    });

    it('ones become threes', () => {
        const tuple = createEmptyTestCase();
        range(0, 16).forEach(i => {
            tuple[1].setWord(DoubleByte.OF(i), Byte.OF(0xFF));
        })
        tuple[0].update(tuple[1]);

        const expected: number[][] = [
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3],
        ];

        expect(tuple[0].getColors()).toEqual(expected);
    });

    it('mixed', () => {
        const tuple = createEmptyTestCase();
        range(0, 16).forEach(i => {
            if (i % 2 === 0) {
                tuple[1].setWord(DoubleByte.OF(i), Byte.OF(170));
            } else {
                tuple[1].setWord(DoubleByte.OF(i), Byte.OF(85));
            }
        })
        tuple[0].update(tuple[1]);

        const expected: number[][] = [
            [1, 2, 1, 2, 1, 2, 1, 2],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [1, 2, 1, 2, 1, 2, 1, 2],
            [1, 2, 1, 2, 1, 2, 1, 2],

        ];

        expect(tuple[0].getColors()).toEqual(expected);
    });

    it('diag', () => {
        const tuple = createEmptyTestCase();
        tuple[1].setWord(DoubleByte.OF(0), Byte.OF(1));
        tuple[0].update(tuple[1]);

        const expected: number[][] = [
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ];

        expect(tuple[0].getColors()).toEqual(expected);
    });
});