import {Byte} from './byte';
import {DoubleByte} from './double-byte';

export class OpCode {
    public logic: (data?: Byte | DoubleByte) => void;
    public cycles: number;
}
