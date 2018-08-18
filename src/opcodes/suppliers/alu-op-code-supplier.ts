import {ALU} from '../../alu';
import {Byte} from '../../byte';
import {OpCodeSupplier} from './op-code-supplier';

export class AluOpCodeSupplier extends OpCodeSupplier{

    protected registerOpcodes(): void {
        const aluMap: { [key: string]: number[][] } = {
            A: [[0x87, 4], [0x8F, 4], [0x97, 4], [0x9F, 4], [0xA7, 4], [0xB7, 4], [0xAF, 4], [0xBF, 4], [0x3C, 4], [0x3D, 4]],
            B: [[0x80, 4], [0x88, 4], [0x90, 4], [0x98, 4], [0xA0, 4], [0xB0, 4], [0xA8, 4], [0xB8, 4], [0x04, 4], [0x05, 4]],
            C: [[0x81, 4], [0x89, 4], [0x91, 4], [0x99, 4], [0xA1, 4], [0xB1, 4], [0xA9, 4], [0xB9, 4], [0x0C, 4], [0x0D, 4]],
            D: [[0x82, 4], [0x8A, 4], [0x92, 4], [0x9A, 4], [0xA2, 4], [0xB2, 4], [0xAA, 4], [0xBA, 4], [0x14, 4], [0x15, 4]],
            E: [[0x83, 4], [0x8B, 4], [0x93, 4], [0x9B, 4], [0xA3, 4], [0xB3, 4], [0xAB, 4], [0xBB, 4], [0x1C, 4], [0x1D, 4]],
            H: [[0x84, 4], [0x8C, 4], [0x94, 4], [0x9C, 4], [0xA4, 4], [0xB4, 4], [0xAC, 4], [0xBC, 4], [0x24, 4], [0x25, 4]],
            L: [[0x85, 4], [0x8D, 4], [0x95, 4], [0x9D, 4], [0xA5, 4], [0xB5, 4], [0xAD, 4], [0xBD, 4], [0x2C, 4], [0x2D, 4]],
            _HL: [[0x86, 4], [0x8E, 4], [0x96, 4], [0x9E, 4], [0xA6, 4], [0xB6, 4], [0xAE, 4], [0xBE, 4], [0x34, 4], [0x35, 4]],
            _NUM: [[0xC6, 4], [0xCE, 4], [0xD6, 4], null, [0xE6, 4], [0xF6, 4], [0xEE, 4], [0xFE, 4], null, null]
        };

        const funcList: ((a: ALU, b: Byte) => void)[] = [
            (a, b) => a.add(b),
            (a, b) => a.sub(b),
            (a, b) => a.adc(b),
            (a, b) => a.sbc(b),
            (a, b) => a.and(b),
            (a, b) => a.or(b),
            (a, b) => a.xor(b),
            (a, b) => a.cp(b),
            (a, b) => a.inc(b),
            (a, b) => a.dec(b),
        ];

        Object.keys(aluMap).forEach((key: string) => {
            if (key !== '_NUM') {
                funcList.forEach(((func: (a: ALU, b: Byte) => void, index: number) => {
                    const tuple: number[] = aluMap[key][index];
                    this.add(tuple[0], (r, m, s, a, d) => {
                        let value: Byte;
                        if (key === '_HL') {
                            value = m.getWord(r.HL);
                        } else {
                            // @ts-ignore
                            value = r[key];
                        }
                        func(a, value);
                    }, tuple[1]);
                }));
            } else {
                funcList.forEach(((func: (a: ALU, b: Byte) => void, index: number) => {
                    const tuple: number[] = aluMap[key][index];
                    if (tuple !== null) {
                        this.add(tuple[0], (r, m, s, a, d: Byte) => func(a, d), tuple[1], 1);
                    }
                }));
            }
        });
    }

}
