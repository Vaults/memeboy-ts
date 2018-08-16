import {Memory} from '../../src/memory';
import {range} from '../../src/lib/util';
import {DoubleByte} from '../../src/double-byte';
import {TileSet} from '../../src/video/tile-set';
import {Byte} from '../../src/byte';
import {TileMap} from '../../src/video/tile-map';


function createTileset(memory: Memory, regionStart: number): TileSet {
    const region: DoubleByte[] = range(regionStart, regionStart + 16).map(i => DoubleByte.OF(i));
    region.forEach(db => memory.setWord(db, Byte.OF(0)));
    return new TileSet(region);
}

describe('simple static tests', () => {
    it('tilemap constructs correct sizes', () => {
        const memory: Memory = new Memory();
        const tileSets = range(0, 256).map(i => createTileset(memory, i * 16));
        tileSets.forEach(s => s.update(memory));

        const tileMap = new TileMap(tileSets, range(0, 1024).map(i => DoubleByte.OF(i)));
        tileMap.update(memory);
        const result = tileMap.getColors();
        expect(result.length).toBe(256);
        result.forEach(row => {
            expect(row.length).toBe(256);
            row.forEach(color => {
                expect(color).toBe(0);
            })
        });
    })
});