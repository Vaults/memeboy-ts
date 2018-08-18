import {Byte} from '../../byte';
import {DoubleByte} from '../../double-byte';
import {OpCodeSupplier} from './op-code-supplier';

export class LoadOpCodeSupplier extends OpCodeSupplier {

    protected registerOpcodes(): void {
        //LD nn,n
        this.add(0x06, (r, m, s, a, d: Byte) => r.B.copy(d), 8, 1);
        this.add(0x0E, (r, m, s, a, d: Byte) => r.C.copy(d), 8, 1);
        this.add(0x16, (r, m, s, a, d: Byte) => r.D.copy(d), 8, 1);
        this.add(0x1E, (r, m, s, a, d: Byte) => r.E.copy(d), 8, 1);
        this.add(0x26, (r, m, s, a, d: Byte) => r.H.copy(d), 8, 1);
        this.add(0x2E, (r, m, s, a, d: Byte) => r.L.copy(d), 8, 1);

        const ldMap: {[key: number] : [string, string]} = {
            0x7F: ['A', 'A'], 0x78: ['A', 'B'], 0x79: ['A', 'C'], 0x7A: ['A', 'D'], 0x7B: ['A', 'E'], 0x7C: ['A', 'H'], 0x7D: ['A', 'L'],
            0x40: ['B', 'B'], 0x41: ['B', 'C'], 0x42: ['B', 'D'], 0x43: ['B', 'E'], 0x44: ['B', 'H'], 0x45: ['B', 'L'], 0x47: ['B', 'A'],
            0x48: ['C', 'B'], 0x49: ['C', 'C'], 0x4A: ['C', 'D'], 0x4B: ['C', 'E'], 0x4C: ['C', 'H'], 0x4D: ['C', 'L'], 0x4F: ['C', 'A'],
            0x50: ['D', 'B'], 0x51: ['D', 'C'], 0x52: ['D', 'D'], 0x53: ['D', 'E'], 0x54: ['D', 'H'], 0x55: ['D', 'L'], 0x57: ['D', 'A'],
            0x58: ['E', 'B'], 0x59: ['E', 'C'], 0x5A: ['E', 'D'], 0x5B: ['E', 'E'], 0x5C: ['E', 'H'], 0x5D: ['E', 'L'], 0x5F: ['E', 'A'],
            0x60: ['H', 'B'], 0x61: ['H', 'C'], 0x62: ['H', 'D'], 0x63: ['H', 'E'], 0x64: ['H', 'H'], 0x65: ['H', 'L'], 0x67: ['H', 'A'],
            0x68: ['L', 'B'], 0x69: ['L', 'L'], 0x6A: ['L', 'D'], 0x6B: ['L', 'E'], 0x6C: ['L', 'H'], 0x6D: ['L', 'L'], 0x6F: ['L', 'A'],
        };

        Object.keys(ldMap).map(i => parseInt(i, 10)).forEach((key: number) => {
            const ldMapElement : [string, string] = ldMap[key];
            // @ts-ignore Ignore index signature, this hack makes registry easier.
            this.add(key, (r, m, s, a, d) => r[ldMapElement[0]].copy(r[ldMapElement[1]]), 4);
        });

        //LD r1,r2
        this.add(0x7E, (r, m, s, a, d) => r.A.copy(m.getWord(r.HL)), 8);
        this.add(0x46, (r, m, s, a, d) => r.B.copy(m.getWord(r.HL)), 8);
        this.add(0x4E, (r, m, s, a, d) => r.C.copy(m.getWord(r.HL)), 8);
        this.add(0x56, (r, m, s, a, d) => r.D.copy(m.getWord(r.HL)), 8);
        this.add(0x5E, (r, m, s, a, d) => r.E.copy(m.getWord(r.HL)), 8);
        this.add(0x66, (r, m, s, a, d) => r.H.copy(m.getWord(r.HL)), 8);
        this.add(0x6E, (r, m, s, a, d) => r.L.copy(m.getWord(r.HL)), 8);

        this.add(0x70, (r, m, s, a, d) => m.setWord(r.HL, r.B), 4);
        this.add(0x71, (r, m, s, a, d) => m.setWord(r.HL, r.C), 4);
        this.add(0x72, (r, m, s, a, d) => m.setWord(r.HL, r.D), 4);
        this.add(0x73, (r, m, s, a, d) => m.setWord(r.HL, r.E), 4);
        this.add(0x74, (r, m, s, a, d) => m.setWord(r.HL, r.H), 4);
        this.add(0x75, (r, m, s, a, d) => m.setWord(r.HL, r.L), 4);
        this.add(0x36, (r, m, s, a, d: Byte) => m.setWord(r.HL, d), 8, 1);

        //LD A,n
        this.add(0x0A, (r, m, s, a, d) => r.A.copy(m.getWord(r.BC)), 8);
        this.add(0x1A, (r, m, s, a, d) => r.A.copy(m.getWord(r.DE)), 8);
        this.add(0xFA, (r, m, s, a, d: DoubleByte) => r.A.copy(m.getWord(d )), 16, 2);
        this.add(0x3E, (r, m, s, a, d: Byte) => r.A.copy(d ), 8, 1);

        //LD n,A
        this.add(0x02, (r, m, s, a, d) => m.setWord(r.BC, r.A), 8);
        this.add(0x12, (r, m, s, a, d) => m.setWord(r.DE, r.A), 8);
        this.add(0x77, (r, m, s, a, d) => m.setWord(r.HL, r.A), 8);
        this.add(0xEA, (r, m, s, a, d: DoubleByte) => m.setWord(d , r.A), 16, 2);

        //LD A,(C)
        // @ts-ignore
        this.add(0xF2, (r, m, s, a, d) => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(r.C);
            r.A.copy(m.getWord(loc))
        }, 8);
        // @ts-ignore
        this.add(0xE2, (r, m, s, a, d) => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(r.C);
            m.setWord(loc, r.A)
        }, 8);

        //LDA,(HLD), LD A,(HL-), LDD A,(HL) and reverse
        this.add(0x3A, (r, m, s, a, d) => { r.A.copy(m.getWord(r.HL)); r.HL.decrement(); }, 8);
        this.add(0x32, (r, m, s, a, d) => { m.setWord(r.HL, r.A); r.HL.decrement(); }, 8);

        //LDA,(HLI), LD A,(HL+), LDD A,(HL) and reverse
        this.add(0x2A, (r, m, s, a, d) => { r.A.copy(m.getWord(r.HL)); r.HL.increment(); }, 8);
        this.add(0x22, (r, m, s, a, d) => { m.setWord(r.HL, r.A); r.HL.increment(); }, 8);
        //LDH (n),A
        this.add(0xE0, (r, m, s, a, d: Byte) => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(d);
            m.setWord(loc, r.A);
        }, 12, 1);
        this.add(0xF0, (r, m, s, a, d: Byte) => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(d);
            r.A.copy(m.getWord(loc));
        }, 12, 1);

        //LDH (C),A
        this.add(0xE3, (r, m, s, a, d) => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(r.C);
            r.A.copy(m.getWord(loc));
        }, 12);

        //LD n,nn
        this.add(0x01, (r, m, s, a, d: DoubleByte) => r.BC.copy(d), 12, 2);
        this.add(0x11, (r, m, s, a, d: DoubleByte) => r.DE.copy(d), 12, 2);
        this.add(0x21, (r, m, s, a, d: DoubleByte) => r.HL.copy(d), 12, 2);
        this.add(0x31, (r, m, s, a, d: DoubleByte) => s.setPointer(d), 12, 2);

        //LD SP,HL
        this.add(0xF9, (r, m, s, a, d) => s.setPointer(r.HL), 8);

        //LD HL,SP+n
        this.add(0xF8, (r, m, s, a, d) => {} /*TODO*/, 12);

        //LD (nn),SP
        this.add(0x08, (r, m, s, a, d: DoubleByte) => s.pushDouble(d), 20, 2);
    }

}
