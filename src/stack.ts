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

    public getPointer() {
        return this.pointer;
    }

    public setPointer(data: DoubleByte) {
        this.pointer = data;
    }

    public increment(){
        this.pointer.increment();
    }

    public decrement(){
        this.pointer.decrement();
    }

    //No types on runtime :(
    public popDouble(): DoubleByte {
        return new DoubleByte(this.popSingle(), this.popSingle());
    }

    public popSingle(): Byte {
        const popped: Byte = this.memory.getWord(this.pointer);
        this.increment();
        return popped;
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
