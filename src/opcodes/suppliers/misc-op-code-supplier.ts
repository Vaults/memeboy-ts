import {Bit} from '../../bit';
import {DoubleByte} from '../../double-byte';
import {OpCodeSupplier} from './op-code-supplier';

export class MiscOpCodeSupplier extends OpCodeSupplier{

    //TODO: make this class obsolete

    protected registerOpcodes(): void {
        //PUSH nn
        this.add(0xF5, (r, m, s, a, d) => s.pushDouble(new DoubleByte(r.A, r.F)), 16);
        this.add(0xC5, (r, m, s, a, d) => s.pushDouble(r.BC), 16);
        this.add(0xD5, (r, m, s, a, d) => s.pushDouble(r.DE), 16);
        this.add(0xE5, (r, m, s, a, d) => s.pushDouble(r.HL), 16);

        //POP nn
        this.add(0xF1, (r, m, s, a, d) => r.AF.copy(s.popDouble()), 12);
        this.add(0xC1, (r, m, s, a, d) => r.BC.copy(s.popDouble()), 12);
        this.add(0xD1, (r, m, s, a, d) => r.DE.copy(s.popDouble()), 12);
        this.add(0xE1, (r, m, s, a, d) => r.HL.copy(s.popDouble()), 12);


        //add HL,n
        this.add(0x09, (r, m, s, a, d) => { /* TODO */ }, 8);
        this.add(0x19, (r, m, s, a, d) => { /* TODO */ }, 8);
        this.add(0x29, (r, m, s, a, d) => { /* TODO */ }, 8);
        this.add(0x39, (r, m, s, a, d) => { /* TODO */ }, 8);

        //add SP,n
        this.add(0xE8, (r, m, s, a, d) => { /* TODO */ }, 16);

        //INC nn
        this.add(0x03, (r, m, s, a, d) => r.BC.increment(), 8);
        this.add(0x13, (r, m, s, a, d) => r.DE.increment(), 8);
        this.add(0x23, (r, m, s, a, d) => r.HL.increment(), 8);
        this.add(0x33, (r, m, s, a, d) => s.increment(), 8);

        //DEC nn
        this.add(0x0B, (r, m, s, a, d) => r.BC.decrement(), 8);
        this.add(0x1B, (r, m, s, a, d) => r.DE.decrement(), 8);
        this.add(0x2B, (r, m, s, a, d) => r.HL.decrement(), 8);
        this.add(0x3B, (r, m, s, a, d) => s.decrement(), 8);


        //DAA
        this.add(0x27, (r, m, s, a, d) => {/* TODO */}, 4);

        //CPL
        this.add(0x2F, (r, m, s, a, d) => r.A.flip(), 4);

        //CCF
        this.add(0x3F, (r, m, s, a, d) => r.FC.flip(), 4);

        //SCF
        this.add(0x37, (r, m, s, a, d) => r.FC.setState(0), 4);

        //NOP
        this.add(0x00, () => {}, 4);

        //HALT
        this.add(0x76, (r, m, s, a, d) => {/* TODO */}, 4);

        //STOP
        this.add(0x10, (r, m, s, a, d) => {/* TODO */}, 4);

        //DI
        this.add(0xF3, (r, m, s, a, d) => {/* TODO */}, 4);

        //EI
        this.add(0xFB, (r, m, s, a, d) => {/* TODO */}, 4);

        //RRCA
        this.add(0x0F, (r, m, s, a, d) => {
            r.FC.copy(r.A.getBit(0));
            r.A.rotate(1);
        }, 4);

        //RLCA
        this.add(0x07, (r, m, s, a, d) => {
            r.FC.copy(r.A.getBit(7));
            r.A.rotate(-1);
        }, 4);

        //RLA TODO generalize
        this.add(0x17, (r, m, s, a, d) => {
            const temp: Bit = Bit.RANDOM();
            temp.copy(r.FC);

            r.FC.copy(r.A.getBit(0));
            r.A.rotate(-1);
            r.A.getBit(7).copy(temp);
            //TODO: fix hack (bit updates do not trigger byte)
            r.A.flip();
            r.A.flip();

            r.checkZero(r.A);
            r.FN.setState(0);
            r.FH.setState(0);

        }, 8);
    }

}
