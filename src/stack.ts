import {DoubleByte} from './double-byte';
import {Memory} from './memory';
import {Byte} from './byte';

export class Stack {
    private memory: Memory;
    private pointer: DoubleByte;

    constructor(memory: Memory) {
        this.memory = memory;
        this.pointer = DoubleByte.OF(0xFFFE)
    }

    public getPointer() {
        return this.pointer;
    }

    public setPointer(data: DoubleByte) {
        this.pointer = data;
    }

    //No types on runtime :(
    public popDouble(): DoubleByte {
        return new DoubleByte(this.popSingle(), this.popSingle());
    }

    public popSingle(): Byte {
        const popped: Byte = this.memory.getWord(this.pointer);
        this.pointer.increment();
        return popped;
    }

    public pushDouble(data: DoubleByte): void {
        this.pushSingle(data.hi);
        this.pushSingle(data.lo);
    }

    public pushSingle(data: Byte): void {
        this.memory.setWord(this.pointer, data);
        this.pointer.decrement();
    }

}
