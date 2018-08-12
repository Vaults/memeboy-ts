import {Memory} from '../memory';
import {DoubleByte} from '../double-byte';
import {range} from '../lib/util';
import {Byte} from '../byte';
import {TileSet} from './tile-set';
import {TileMap} from './tile-map';

export class GPU {
    private memory: Memory;

    private SCROLL_X: number = 0xFF43;
    private SCROLL_Y: number = 0xFF42;

    private YCOORDINATE: number = 0xFF45;
    private LYCOMPARE: number = 0xFF44;

    private WINDOW_X: number = 0xFF4B;
    private WINDOW_Y: number = 0xFF4A;

    private BG_PALLETTE: number = 0xFF47;

    private CONTROL_REGISTER: number = 0xFF40;

    private pixelMap: number[][];
    private offsetX: number = 0;
    private offsetY: number = 0;

    private tileSets: TileSet[] = [];

    private mapZero: TileMap;
    private mapOne: TileMap;

    constructor(memory: Memory) {
        this.memory = memory;
        range(0, 128 * 3).forEach(i => {
            const tileSet = new TileSet(this.region( i * 16 + 0x8000, (i + 1) * 16 + 0x8000));
            this.memory.attachObserverToRegion(tileSet.getRegion(), () => tileSet.update(this.memory));
            this.tileSets.push(tileSet);
        });

        this.mapZero = new TileMap(this.tileSets.slice(0, 256), this.region(0x9800, 0x9BFF));
        this.memory.attachObserverToRegion(this.mapZero.getRegion(), () => this.mapZero.update(memory));
        this.mapOne = new TileMap(this.tileSets.slice(128, 128 * 3), this.region(0x9C00, 0x9FFF));
        this.memory.attachObserverToRegion(this.mapOne.getRegion(), () => this.mapOne.update(memory));
    }


    private region(a: number, b: number): DoubleByte[] {
        return range(a, b).map(i => DoubleByte.OF(i));
    }

    public getScreen(): number[][] {
        this.tileSets.forEach(o => o.update(this.memory));
        this.mapZero.update(this.memory);
        //TODO map change and stuff
        this.pixelMap = this.mapZero.getColors();
        //TODO Hblank, Vblank, all that jazz
        return this.pixelMap.slice(this.offsetX, this.offsetX + 160).map(o => o.slice(this.offsetY, this.offsetY + 144));
    }
}