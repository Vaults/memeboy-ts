import {DoubleByte} from '../double-byte';
import {Memory} from '../memory';
import {Byte} from '../byte';
import {range} from '../lib/util';

export class TileSet {

    private region: DoubleByte[];
    private internalColors: number[][] = [];


    constructor(region: DoubleByte[]){
        if (region.length !== 16){
            throw new Error(`Invalid region size! ${region.length}`);
        }
        this.region = region;
    }

    public update(memory: Memory){
        const tempBytes: Byte[] = [];
        this.region.forEach((loc: DoubleByte) => tempBytes.push(memory.getWord(loc)));

        this.internalColors = [];
        while (tempBytes.length > 0) {
            const top = tempBytes.pop();
            const bottom = tempBytes.pop();

            const combined: number[] = [];
            range(0, 8).forEach(i => {
                combined.push(parseInt(top.getBit(i).val() + '' + bottom.getBit(i).val(), 2));
            })

            this.internalColors.push(combined);
        }
    }

    public getRegion(): DoubleByte[]{
        return this.region;
    }

    public getColors(): number[][] {
        return this.internalColors;
    }
}