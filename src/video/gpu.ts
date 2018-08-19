import {Byte} from '../byte';
import {DoubleByte} from '../double-byte';
import {range, sliceCircular, trueModulo} from '../lib/util';
import {Memory} from '../memory';
import {IRenderer} from './i-renderer';
import {TileMap} from './tile-map';
import {TileSet} from './tile-set';

export class GPU {

    private readonly memory: Memory;

    private readonly SCROLL_X: number = 0xFF43;
    private readonly SCROLL_Y: number = 0xFF42;

    private readonly YCOORDINATE: number = 0xFF44;
    private readonly LYCOMPARE: number = 0xFF45;

    private readonly WINDOW_X: number = 0xFF4B;
    private readonly WINDOW_Y: number = 0xFF4A;

    private readonly BG_PALETTE: number = 0xFF47;

    private readonly CONTROL_REGISTER: number = 0xFF40;

    private pixelMap: number[][];

    private readonly tileSets: TileSet[] = [];

    private mapZero: TileMap;
    private mapOne: TileMap;
    private readonly renderer: IRenderer;

    private shouldUpdate: boolean = false;

    constructor(memory: Memory, renderer: IRenderer) {
        this.memory = memory;
        //TODO: Find out how this one should be set to 0.
        this.memory.setWord(DoubleByte.OF(this.SCROLL_X), Byte.OF(0));
        this.renderer = renderer;

        range(0, 128 * 3).forEach(i => {
            const tileSet = new TileSet(this.region(i * 16 + 0x8000, (i + 1) * 16 + 0x8000));
            this.memory.attachObserverToRegion(tileSet.getRegion(), () => {
                tileSet.update(this.memory);
                this.shouldUpdate = true;
            });
            tileSet.update(memory);
            this.tileSets.push(tileSet);
        });

        this.mapZero = new TileMap(this.tileSets.slice(0, 256), this.region(0x9800, 0x9C00));
        this.memory.attachObserverToRegion(this.mapZero.getRegion(), () => {
            this.mapZero.update(memory);
            this.shouldUpdate = true;
        });
        this.mapZero.update(memory);
        this.mapOne = new TileMap(this.tileSets.slice(128), this.region(0x9C00, 0xA000));
        this.memory.attachObserverToRegion(this.mapOne.getRegion(), () => {
            this.mapOne.update(memory);
            this.shouldUpdate = true;
        });
        this.mapOne.update(memory);

        this.updateScreen();
        setInterval(() => {
            renderer.render(this.pixelMap);
        }, 1000 / 24);
    }

    private region(a: number, b: number): DoubleByte[] {
        return range(a, b).map(i => DoubleByte.OF(i));
    }

    private updateScreen() {
        const offsetX = this.memory.getWord(DoubleByte.OF(this.SCROLL_X)).toNumber();
        const offsetY = this.memory.getWord(DoubleByte.OF(this.SCROLL_Y)).toNumber();
        this.mapZero.update(this.memory);
        const paletteMap = this.getPaletteMap();
        const newMap = sliceCircular(this.mapZero.getColors(), offsetY, offsetY + 144).map(o => sliceCircular(o, offsetX, offsetX + 160));
        if (JSON.stringify(newMap) !== JSON.stringify(this.pixelMap)) {
            this.pixelMap = newMap.map(row => row.map(col => paletteMap[col]));
            this.renderer.render(this.pixelMap);
        }
    }

    private getPaletteMap(): {[key: number]: number} {
        const palette = this.memory.getWord(DoubleByte.OF(this.BG_PALETTE));
        // No templating here. Just concatenating two numbers as strings.
        // tslint:disable-next-line
        const getColor = (i: number) => parseInt(palette.getBit(i * 2).val() + '' + palette.getBit(i * 2 + 1).val(), 2);
        return {
            0 : getColor(3),
            1 : getColor(2),
            2 : getColor(1),
            3 : getColor(0)
        };
    }

    public runInstruction(currentClock: number) {
        //TODO: check if correct timing necessary
        if (currentClock % 456 == 0) {
            const yCoordPointer = DoubleByte.OF(this.YCOORDINATE);
            const yCoord = this.memory.getWord(yCoordPointer);
            this.memory.setWord(yCoordPointer, Byte.OF(trueModulo(yCoord.toNumber() + 1, 0x99)));
        }
        if (currentClock % 70224 === 0) {
            this.updateScreen();
        }

    }
}
