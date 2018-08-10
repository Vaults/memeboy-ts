import {Byte} from '../src/byte';
import {ALU} from '../src/alu';

describe('constructor', () => {
    // TODO
    it('test', () => {
        const alu: ALU = new ALU(new Byte(255), new Byte(255));
        alu.add(null);
    });
});
