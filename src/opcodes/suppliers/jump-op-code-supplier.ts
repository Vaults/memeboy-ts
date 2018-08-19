import {Byte} from '../../byte';
import {DoubleByte} from '../../double-byte';
import {OpCodeLogic} from '../op-code';
import {OpCodeSupplier} from './op-code-supplier';

export class JumpOpCodeSupplier extends OpCodeSupplier {

    protected registerOpcodes(): void {
        const wrapNZ: (logic: OpCodeLogic) => OpCodeLogic = (logic) => (r, m, s, a, d) => { if (!r.FZ.isSet()) { logic(r, m, s, a, d); }};
        const wrapZ: (logic: OpCodeLogic) => OpCodeLogic = (logic) => (r, m, s, a, d) => { if (r.FZ.isSet()) { logic(r, m, s, a, d); }};
        const wrapNC: (logic: OpCodeLogic) => OpCodeLogic = (logic) => (r, m, s, a, d) => { if (!r.FC.isSet()) { logic(r, m, s, a, d); }};
        const wrapC: (logic: OpCodeLogic) => OpCodeLogic = (logic) => (r, m, s, a, d) => { if (r.FC.isSet()) { logic(r, m, s, a, d); }};

        //JUMP NZ, Z, NC, C
        const jump: OpCodeLogic = (r, m, s, a, d: Byte) => r.PC.addSigned(d);
        this.add(0x18, jump, 8,  1);
        this.add(0x20, wrapNZ(jump), 8, 1);
        this.add(0x28, wrapZ(jump), 8, 1);
        this.add(0x30, wrapNC(jump), 8, 1);
        this.add(0x38, wrapC(jump), 8, 1);

        //CALL nn
        const call : OpCodeLogic = (r, m, s, a, d: DoubleByte) => {
            r.PC.increment();
            s.pushDouble(r.PC);
            r.PC.copy(d);
            r.PC.decrement();
        };
        this.add(0xCD, call, 12, 2);

        //CALL cc,nn
        this.add(0xC4, wrapNZ(jump), 12, 2);
        this.add(0xCC, wrapZ(jump), 12, 2);
        this.add(0xD4, wrapNC(jump), 12, 2);
        this.add(0xDC, wrapC(jump), 12, 2);

        //RET
        this.add(0xC9, (r, m, s, a, d) => {
            r.PC.copy(s.popDouble());
            r.PC.decrement();
        }, 8);
    }

}
