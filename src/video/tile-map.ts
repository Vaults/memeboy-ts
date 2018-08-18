import {DoubleByte} from '../double-byte';
import {range} from '../lib/util';
import {Memory} from '../memory';
import {TileSet} from './tile-set';

export class TileMap {
    private readonly sets: TileSet[];
    private readonly region: DoubleByte[];

    private locs: number[] = [];

    constructor(sets: TileSet[], region: DoubleByte[]) {
        if (region.length !== 1024) {
            throw new Error(`Invalid region size! ${region.length}`);
        }
        if (sets.length !== 256) {
            throw new Error(`Invalid sets size! ${sets.length}`);
        }
        this.sets = sets;
        this.region = region;
    }

    public update(memory: Memory) {
        this.locs = [];
        this.region.forEach((loc: DoubleByte) => {
            this.locs.push(memory.getWord(loc).toNumber());
        });
    }

    public getRegion(): DoubleByte[] {
        return this.region;
    }

    public getColors(): number[][] {
        const tileList: number[][][] = this.locs.map(i => this.sets[i].getColors());

        const concatTilesetRow = (tileSetRow: number[][][]) => {
            return tileSetRow.reduce((acc, tileSet) => acc.map((row, index) => row.concat(tileSet[index])), range(0, 8).map(() => []));
        };

        return range(0, 32)
            .map(i => tileList.slice(i * 32, (i + 1) * 32))
            .map(concatTilesetRow)
            .reduce((p, n) => p.concat(n));
    }
}
