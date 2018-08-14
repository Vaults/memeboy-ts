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
    --------------------------- 4000 |= 32kB Cartrigbe
    16kB ROM bank #0 |
    --------------------------- 0000
    */

import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {numberToHex, range} from './lib/util';
import {DEBUG} from './lib/debug';

export class Memory {
    private INTERNAL_DATA: Byte[] = [];
    private observers: {[location: number]: ((location: DoubleByte, data: Byte) => void)[]}

    constructor() {
        this.INTERNAL_DATA = range(0, 2 ** 16).map(() => Byte.RANDOM());
        this.observers = range(0, 2 ** 16).map(() => []);
    }

    public getWord(pointer: DoubleByte) {
        return this.INTERNAL_DATA[pointer.toNumber()];
    }

    public setWord(pointer: DoubleByte, value: Byte) {
        DEBUG.INFO(numberToHex(pointer.toNumber()));
        this.INTERNAL_DATA[pointer.toNumber()].copy(value);
        DEBUG.INFO(numberToHex(this.INTERNAL_DATA[pointer.toNumber()].toNumber()))
        this.observers[pointer.toNumber()].forEach(observer => observer(pointer, value));
    }

    public setDoubleWord(pointer: DoubleByte, value: DoubleByte) {
        this.INTERNAL_DATA[pointer.toNumber()].copy(value.hi)
        this.INTERNAL_DATA[pointer.toNumber() + 1].copy(value.lo);
    }

    public attachObserverToLocation(location: DoubleByte, callback: (location: DoubleByte, data: Byte) => void) {
        this.observers[location.toNumber()].push(callback);
    }

    public attachObserverToRegion(region: DoubleByte[], callback: (location: DoubleByte, data: Byte) => void) {
        region.forEach((loc: DoubleByte) => {
            this.attachObserverToLocation(loc, callback);
        })
    }

    public setRegion(start: DoubleByte, data: Byte[]) {
        //modifies start byte
        data.forEach(o => {this.setWord(start, o); start.increment(); } )
    }

}
