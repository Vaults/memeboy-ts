import {Bit} from '../../bit';
import {Byte} from '../../byte';
import {range} from '../../lib/util';
import {OpCodeLogic} from '../op-code';
import {OpCodeSupplier} from './op-code-supplier';

export class ExtendedOpCodeSupplier extends OpCodeSupplier {

    //TODO: this class is insane, fix this shit

    protected registerOpcodes(): void {
        const BIT: (d: Byte, index: number) => OpCodeLogic = (byte, index) => (r, m, s, a, d) => {
            //TODO neatify
            if (byte.getBit(7- index).isSet()) {
                r.FZ.setState(0);
            } else {
                r.FZ.setState(1);
            }
            r.FN.setState(0);
            r.FH.setState(1);
        };
        const SET: (d: Byte, index: number) => OpCodeLogic = (byte, index) => (r, m, s, a, d) => byte.getBit(7 - index).setState(1);
        const RES: (d: Byte, index: number) => OpCodeLogic = (byte, index) => (r, m, s, a, d) => byte.getBit(7 - index).setState(0);
        const RL: (d: Byte) => OpCodeLogic = (byte) => (r, m, s, a, d) => {
            const temp: Bit = Bit.RANDOM();
            temp.copy(r.FC);

            r.FC.copy(byte.getBit(0));
            byte.rotate(-1);
            byte.getBit(7).copy(temp);
            //TODO: fix hack (bit updates do not trigger byte)
            byte.flip();
            byte.flip();

            r.checkZero(byte);
            r.FN.setState(0);
            r.FH.setState(0);
        };
        const RR: (d: Byte) => OpCodeLogic = (byte) => (r, m, s, a, d) => {
            const temp: Bit = Bit.RANDOM();
            temp.copy(r.FC);

            r.FC.copy(byte.getBit(7));
            byte.rotate(1);
            byte.getBit(0).copy(temp);
            //TODO: fix hack (bit updates do not trigger byte)
            byte.flip();
            byte.flip();

            r.checkZero(byte);
            r.FN.setState(0);
            r.FH.setState(0);
        };
        const SWAP: (d: Byte) => OpCodeLogic = (byte) => (r, m, s, a, d) => {
            byte.swap();
        };

        const wrapByte: (iden: string, logic: (b: Byte) => OpCodeLogic) => OpCodeLogic = (iden, logic) => (r, m, s, a, d) => {
            // @ts-ignore I shouldn't be doing this mad science dark magic shit
            const byte: Byte = r[iden];
            logic(byte)(r,m,s,a,d);
        }

        const order: string[] = ['B', 'C', 'D', 'E', 'H', 'L', null, 'A'];
        range(0, 8).forEach(row => {
            order.forEach((iden: string, col: number) => {
                if (iden !== null) {
                    this.add(0x40 + row * 8 + col, wrapByte(iden, b => BIT(b, row)), 8);
                    this.add(0x80 + row * 8 + col, wrapByte(iden, b => SET(b, row)), 8);
                    this.add(0xC0 + row * 8 + col, wrapByte(iden, b => RES(b, row)), 8);
                }
            });
            if (order[row] !== null) {
                const iden: string = order[row];
                this.add(0x10 + row, wrapByte(iden, RL), 8);
                this.add(0x20 + row, wrapByte(iden, RR), 8);
                this.add(0x30 + row, wrapByte(iden, SWAP), 8);
            }

            this.add(0x40 + row * 8 + 6, (r, m, s, a, d) => BIT(m.getWord(r.HL), row)(r, m, s, a, d), 8);
            this.add(0x80 + row * 8 + 6, (r, m, s, a, d) => BIT(m.getWord(r.HL), row)(r, m, s, a, d), 8);
            this.add(0xC0 + row * 8 + 6, (r, m, s, a, d) => BIT(m.getWord(r.HL), row)(r, m, s, a, d), 8);
        });

        this.add(0x16, (r, m, s, a, d) => RL(m.getWord(r.HL))(r, m, s, a, d), 8);
        this.add(0x26, (r, m, s, a, d) => RR(m.getWord(r.HL))(r, m, s, a, d), 8);
        this.add(0x36, (r, m, s, a, d) => SWAP(m.getWord(r.HL))(r, m, s, a, d), 8);
    }

}
