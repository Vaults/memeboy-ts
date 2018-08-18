import {Byte} from '../byte';
import {DoubleByte} from '../double-byte';

export class OpCode {
    public logic: (data?: Byte | DoubleByte) => void;
    public cycles: number;
    public dataBytes: number;

    constructor(logic: (data?: Byte | DoubleByte) => void, cycles: number, dataBytes: number = 0) {
        this.logic = logic;
        this.cycles = cycles;
        this.dataBytes = dataBytes;
    }
}
