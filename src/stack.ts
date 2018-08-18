import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {Memory} from './memory';

export class Stack {
    private memory: Memory;
    private pointer: DoubleByte;

    constructor(memory: Memory) {
        this.memory = memory;
        this.pointer = DoubleByte.OF(~~(Math.random() * 2 ** 16));
    }

    public setPointer(data: DoubleByte) {
        this.pointer = data;
    }

    public increment() {
        this.pointer.increment();
    }

    public decrement() {
        this.pointer.decrement();
    }

    //No types on runtime :(
    public popDouble(): DoubleByte {
        const lo = this.popSingle();
        return new DoubleByte(this.popSingle(), lo);
    }

    public popSingle(): Byte {
        this.increment();
        return this.memory.getWord(this.pointer);
    }

    public pushDouble(data: DoubleByte): void {
        this.pushSingle(data.hi);
        this.pushSingle(data.lo);
    }

    public pushSingle(data: Byte): void {
        this.memory.setWord(this.pointer, data);
        this.decrement();
    }

}
