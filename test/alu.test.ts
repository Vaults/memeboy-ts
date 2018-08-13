import {Byte} from '../src/byte';
import {ALU} from '../src/alu';
import {RegisterRegistry} from '../src/register-registry';

describe('constructor', () => {
    // TODO
    it('test', () => {
        const alu: ALU = new ALU(new RegisterRegistry());
        alu.add(Byte.OF(1));
    });
});
