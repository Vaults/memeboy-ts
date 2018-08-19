/*
    Interrupt Enable Register
    --------------------------- FFFF
    Internal RAM
    --------------------------- FF80
    Empty but unusable for I/O
        --------------------------- FF4C
    I/O ports
    --------------------------- FF00
    Empty but unusable for I/O
        --------------------------- FEA0
    Sprite Attrib Memory (OAM)
    --------------------------- FE00
    Echo of 8kB Internal RAM
    --------------------------- E000
    8kB Internal RAM
    --------------------------- C000
    8kB switchable RAM bank
    --------------------------- A000
    8kB Video RAM
    --------------------------- 8000 --
    16kB switchable ROM bank |
    --------------------------- 4000 |= 32kB Cartridge
    16kB ROM bank #0 |
    --------------------------- 0000
    */

import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {range} from './lib/util';

export class Memory {
    private readonly INTERNAL_DATA: Byte[] = [];
    private readonly observers: {[location: number]: ((location: DoubleByte, data: Byte) => void)[]};

    constructor() {
        this.INTERNAL_DATA = range(0, 2 ** 16).map(() => Byte.RANDOM());
        this.observers = range(0, 2 ** 16).map(() => []);
    }

    public getWord(pointer: DoubleByte) {
        const copy: Byte = new Byte();
        copy.copy(this.INTERNAL_DATA[pointer.toNumber()]);
        return copy;
    }

    public setWord(pointer: DoubleByte, value: Byte) {
        this.INTERNAL_DATA[pointer.toNumber()].copy(value);
        this.observers[pointer.toNumber()].forEach(observer => observer(pointer, value));
    }

    public attachObserverToLocation(location: DoubleByte, callback: (location: DoubleByte, data: Byte) => void) {
        this.observers[location.toNumber()].push(callback);
    }

    public attachObserverToRegion(region: DoubleByte[], callback: (location: DoubleByte, data: Byte) => void) {
        region.forEach((loc: DoubleByte) => {
            this.attachObserverToLocation(loc, callback);
        });
    }

    public setRegion(start: DoubleByte, data: Byte[]) {
        //modifies start byte
        data.forEach(o => {
            this.setWord(start, o);
            start.increment();
        });
    }

}
