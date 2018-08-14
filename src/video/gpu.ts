import {Memory} from '../memory';
import {DoubleByte} from '../double-byte';
import {range} from '../lib/util';
import {Byte} from '../byte';
import {TileSet} from './tile-set';
import {TileMap} from './tile-map';
import {IRenderer} from './i-renderer';

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
    private renderer: IRenderer;

    constructor(memory: Memory, renderer: IRenderer) {
        this.memory = memory;
        this.renderer = renderer;

        range(0, 128 * 3).forEach(i => {
            const tileSet = new TileSet(this.region( i * 16 + 0x8000, (i + 1) * 16 + 0x8000));
            this.memory.attachObserverToRegion(tileSet.getRegion(), () => {
                tileSet.update(this.memory);
                this.updateScreen();
            });
            tileSet.update(memory);
            this.tileSets.push(tileSet);
        });

        this.mapZero = new TileMap(this.tileSets.slice(0, 256), this.region(0x9800, 0x9C00));
        this.memory.attachObserverToRegion(this.mapZero.getRegion(), () => this.mapZero.update(memory));
        this.mapZero.update(memory);
        this.mapOne = new TileMap(this.tileSets.slice(128, 128 * 3), this.region(0x9C00, 0xA000));
        this.memory.attachObserverToRegion(this.mapOne.getRegion(), () => this.mapOne.update(memory));
        this.mapOne.update(memory);

        this.updateScreen();
    }


    private region(a: number, b: number): DoubleByte[] {
        return range(a, b).map(i => DoubleByte.OF(i));
    }

    public updateScreen(){
        const newMap = this.mapZero.getColors().slice(this.offsetX, this.offsetX + 160).map(o => o.slice(this.offsetY, this.offsetY + 144));
        if (JSON.stringify(newMap) !== JSON.stringify(this.pixelMap)){
            this.pixelMap = newMap;
            this.renderer.render(this.pixelMap);
        }
    }

}