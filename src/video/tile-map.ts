import {TileSet} from './tile-set';
import {Memory} from '../memory';
import {DoubleByte} from '../double-byte';
import {range} from '../lib/util';

export class TileMap {
    private sets: TileSet[];
    private locs: number[] = []
    private region: DoubleByte[];

    constructor(sets: TileSet[], region: DoubleByte[]){
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
        return range(0, 8)
            .map(i => tileList.slice(i * 8, (i + 1) * 8))
            .map(tileSetRow => tileSetRow.reduce((acc, tileSet) => acc.map((o, i) => o.concat(tileSet[i])) , [[], [], [], [], [], [], [], []]))
            .reduce((p, n) => p.concat(n));
    }
}