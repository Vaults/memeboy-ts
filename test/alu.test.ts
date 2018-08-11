import {Byte} from '../src/byte';
import {ALU} from '../src/alu';

describe('constructor', () => {
    // TODO
    it('test', () => {
        const alu: ALU = new ALU(Byte.OF(255), Byte.OF(255));
        alu.add(null);
    });
});
