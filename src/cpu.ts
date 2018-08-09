import {Bit} from './bit';
import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {Memory} from './memory';
import {OpCode} from './op-code';
import {Stack} from './stack';
import {ALU} from './alu';

class CPU {

    //Usually for data transferring
    private B: Byte = new Byte();
    private C: Byte = new Byte();
    private BC: DoubleByte;
    //Regular registers
    private D: Byte = new Byte();
    private E: Byte = new Byte();
    private DE: DoubleByte;
    //Indirect addressing
    private H: Byte = new Byte();
    private L: Byte = new Byte();
    private HL: DoubleByte;

    //Accumulator
    private A: Byte = new Byte();
    //Flags
    private FZ: Bit = new Bit();
    private FN: Bit = new Bit();
    private FH: Bit = new Bit();
    private FC: Bit = new Bit();

    private F: Byte = Byte.OF([this.FZ, this.FN, this.FC, this.FH, new Bit(0), new Bit(0), new Bit(0), new Bit(0)]);
    private AF: DoubleByte = new DoubleByte(this.A, this.F);

    private PC: DoubleByte = DoubleByte.OF(0x0100);

    private opCodes: {[key: number] : OpCode} = {};
    private memory: Memory;
    private stack: Stack;
    private alu: ALU;

    constructor(memory: Memory, stack: Stack, alu: ALU) {
        this.initializeOpcodes();
        this.memory = memory;
        this.stack = stack;
        this.alu = alu;
        this.BC = new DoubleByte(this.B, this.C);
        this.DE = new DoubleByte(this.D, this.E);
        this.HL = new DoubleByte(this.H, this.L);
    }

    private initializeOpcodes(): void {
        const add = (byte: number, logic: (data?: Byte | DoubleByte) => void, cycles: number) => {
            if (this.opCodes[byte]) {
                throw new Error(`OPCODE NUMBER ${byte} DEFINED TWICE!`);
            }
            this.opCodes[byte] = {logic, cycles};
        };
        const NOOP = () => {};



        //LD nn,n
        add(0x06, (d: Byte) => this.B = d, 8);
        add(0x0E, (d: Byte) => this.C = d, 8);
        add(0x16, (d: Byte) => this.D = d, 8);
        add(0x1E, (d: Byte) => this.E = d, 8);
        add(0x26, (d: Byte) => this.H = d, 8);
        add(0x2E, (d: Byte) => this.L = d, 8);

        //LD r1,r2
        add(0x7F, NOOP, 4);
        add(0x78, () => { this.A = this.B; }, 4);
        add(0x79, () => { this.A = this.C; }, 4);
        add(0x7A, () => { this.A = this.D; }, 4);
        add(0x7B, () => { this.A = this.E; }, 4);
        add(0x7C, () => { this.A = this.H; }, 4);
        add(0x7D, () => { this.A = this.L; }, 4);
        add(0x7E, () => { this.A = this.memory.getWord(this.HL); }, 8);

        add(0x40, NOOP , 4);
        add(0x41, () => { this.B = this.C; }, 4);
        add(0x42, () => { this.B = this.D; }, 4);
        add(0x43, () => { this.B = this.E; }, 4);
        add(0x44, () => { this.B = this.H; }, 4);
        add(0x45, () => { this.B = this.L; }, 4);
        add(0x46, () => { this.B = this.memory.getWord(this.HL); }, 8);

        add(0x48, () => { this.C = this.B; }, 4);
        add(0x49, NOOP, 4);
        add(0x4A, () => { this.C = this.D; }, 4);
        add(0x4B, () => { this.C = this.E; }, 4);
        add(0x4C, () => { this.C = this.H; }, 4);
        add(0x4D, () => { this.C = this.L; }, 4);
        add(0x4E, () => { this.C = this.memory.getWord(this.HL); }, 8);

        add(0x50, () => { this.D = this.B; }, 4);
        add(0x51, () => { this.D = this.C; }, 4);
        add(0x52, NOOP, 4);
        add(0x53, () => { this.D = this.E; }, 4);
        add(0x54, () => { this.D = this.H; }, 4);
        add(0x55, () => { this.D = this.L; }, 4);
        add(0x56, () => { this.D = this.memory.getWord(this.HL); }, 8);

        add(0x58, () => { this.E = this.B; }, 4);
        add(0x59, () => { this.E = this.C; }, 4);
        add(0x5A, () => { this.E = this.D; }, 4);
        add(0x5B, NOOP, 4);
        add(0x5C, () => { this.E = this.H; }, 4);
        add(0x5D, () => { this.E = this.L; }, 4);
        add(0x5E, () => { this.E = this.memory.getWord(this.HL); }, 8);

        add(0x60, () => { this.H = this.B; }, 4);
        add(0x61, () => { this.H = this.C; }, 4);
        add(0x62, () => { this.H = this.D; }, 4);
        add(0x63, () => { this.H = this.E; }, 4);
        add(0x64, NOOP, 4);
        add(0x65, () => { this.H = this.L; }, 4);
        add(0x66, () => { this.H = this.memory.getWord(this.HL); }, 8);

        add(0x68, () => { this.L = this.B; }, 4);
        add(0x69, () => { this.L = this.C; }, 4);
        add(0x6A, () => { this.L = this.D; }, 4);
        add(0x6B, () => { this.L = this.E; }, 4);
        add(0x6C, () => { this.L = this.H; }, 4);
        add(0x6D, NOOP, 4);
        add(0x6E, () => { this.L = this.memory.getWord(this.HL); }, 8);

        add(0x70, () => { this.memory.setWord(this.HL, this.B); }, 4);
        add(0x71, () => { this.memory.setWord(this.HL, this.C); }, 4);
        add(0x72, () => { this.memory.setWord(this.HL, this.D); }, 4);
        add(0x73, () => { this.memory.setWord(this.HL, this.E); }, 4);
        add(0x74, () => { this.memory.setWord(this.HL, this.H); }, 4);
        add(0x75, () => { this.memory.setWord(this.HL, this.L); }, 4);
        add(0x36, (data: Byte) => { this.memory.setWord(this.HL, data); }, 8);

        //LD A,n
        add(0x0A, () => { this.A = this.memory.getWord(this.BC); }, 8);
        add(0x1A, () => { this.A = this.memory.getWord(this.DE); }, 8);
        add(0xFA, (data: DoubleByte) => { this.A = this.memory.getWord(data); }, 16);
        add(0xFA, (data: Byte) => { this.A = data; }, 8);

        //LD n,A
        add(0x02, () => { this.memory.setWord(this.BC, this.A); }, 8);
        add(0x12, () => { this.memory.setWord(this.DE, this.A); }, 8);
        add(0xEA, (data: DoubleByte) => { this.memory.setWord(data, this.A); }, 16);

        //LD A,(C)
        add(0xF2, () => { this.A = this.memory.getWord(DoubleByte.OF(0xFF00).add(this.C)); }, 8);
        add(0xF2, () => { this.memory.setWord(DoubleByte.OF(0xFF00).add(this.C), this.A); }, 8);

        //LDA,(HLD), LD A,(HL-), LDD A,(HL) and reverse
        add(0x3A, () => { this.A = this.memory.getWord(this.HL); this.HL.decrement(); }, 8);
        add(0x32, () => { this.memory.setWord(this.HL, this.A); this.HL.decrement(); }, 8);

        //LDA,(HLI), LD A,(HL+), LDD A,(HL) and reverse
        add(0x2A, () => { this.A = this.memory.getWord(this.HL); this.HL.increment(); }, 8);
        add(0x22, () => { this.memory.setWord(this.HL, this.A); this.HL.increment(); }, 8);

        //LDH (n),A
        add(0xE0, (data: Byte) => { this.A = this.memory.getWord(DoubleByte.OF(0xFF00).add(data)); }, 12);
        add(0xF0, (data: Byte) => { this.memory.setWord(DoubleByte.OF(0xFF00).add(data), this.A); }, 12);

        //LD n,nn
        add(0x01, (data: DoubleByte) => { this.BC = data; }, 12);
        add(0x11, (data: DoubleByte) => { this.DE = data; }, 12);
        add(0x21, (data: DoubleByte) => { this.HL = data; }, 12);
        add(0x32, (data: DoubleByte) => { this.stack.setPointer(data); }, 12);

        //LD SP,HL
        add(0xF9, () => { this.stack.setPointer(this.HL); }, 8);

        //LD HL,SP+n
        add(0xF8, null /* TODO */, 12);

        //LD (nn),SP
        add(0x08, (data: DoubleByte) => this.stack.pushDouble(data), 20);

        //PUSH nn
        add(0xF5, () => { this.stack.pushDouble(new DoubleByte(this.A, this.F)); }, 16);
        add(0xC5, () => { this.stack.pushDouble(this.BC); }, 16);
        add(0xD5, () => { this.stack.pushDouble(this.DE); }, 16);
        add(0xE5, () => { this.stack.pushDouble(this.HL); }, 16);

        //POP nn
        add(0xF1, () => { this.AF = this.stack.popDouble(); }, 12);
        add(0xC1, () => { this.BC = this.stack.popDouble(); }, 12);
        add(0xD1, () => { this.DE = this.stack.popDouble(); }, 12);
        add(0xE1, () => { this.HL = this.stack.popDouble(); }, 12);

        const aluMap: {[key: string] : number[][]} = {
            A: [[0x87, 4], [0x8F, 4], [0x97, 4], [0x9F, 4], [0xA7, 4], [0xB7, 4], [0xAF, 4], [0xBF, 4], [0x3C, 4], [0x3D, 4]],
            B: [[0x80, 4], [0x88, 4], [0x90, 4], [0x98, 4], [0xA0, 4], [0xB0, 4], [0xA8, 4], [0xB8, 4], [0x04, 4], [0x05, 4]],
            C: [[0x81, 4], [0x89, 4], [0x91, 4], [0x99, 4], [0xA1, 4], [0xB1, 4], [0xA9, 4], [0xB9, 4], [0x0C, 4], [0x0D, 4]],
            D: [[0x82, 4], [0x8A, 4], [0x92, 4], [0x9A, 4], [0xA2, 4], [0xB2, 4], [0xAA, 4], [0xBA, 4], [0x14, 4], [0x15, 4]],
            E: [[0x83, 4], [0x8B, 4], [0x93, 4], [0x9B, 4], [0xA3, 4], [0xB3, 4], [0xAB, 4], [0xBB, 4], [0x1C, 4], [0x1D, 4]],
            H: [[0x84, 4], [0x8C, 4], [0x94, 4], [0x9C, 4], [0xA4, 4], [0xB4, 4], [0xAC, 4], [0xBC, 4], [0x24, 4], [0x25, 4]],
            L: [[0x85, 4], [0x8D, 4], [0x95, 4], [0x9D, 4], [0xA5, 4], [0xB5, 4], [0xAD, 4], [0xBD, 4], [0x2C, 4], [0x2D, 4]],
            _HL: [[0x86, 4], [0x8E, 4], [0x96, 4], [0x9E, 4], [0xA6, 4], [0xB6, 4], [0xAE, 4], [0xBE, 4], [0x34, 4], [0x35, 4]],
            _NUM: [[0xC6, 4], [0xCE, 4], [0xD6, 4], null, [0xE6, 4], [0xB6, 4], [0xEE, 4], [0xFE, 4], null, null]
        };

        const funcList: ((b: Byte) => void)[] = [this.alu.add, this.alu.adc, this.alu.sub, this.alu.and, this.alu.or, this.alu.xor, this.alu.cp, this.alu.inc, this.alu.dec];

        Object.keys(aluMap).forEach((key: String) => {
            let value: Byte;
            if (key !== '_NUM') {
                if (key === '_HL') {
                    value = this.memory.getWord(this.HL);
                } else {
                    value = this[key];
                }
                funcList.forEach(((func: (b: Byte) => void, index: number) => {
                   const tuple: number[] = aluMap[key][index];
                   add(tuple[0], () => func(value), tuple[1]);
                }));
            } else {
                //TODO
            }
        });


    }

    private executeOpCode(opCode: Byte, data?: Byte | DoubleByte) {
        if (this.opCodes[opCode.toNumber()]) {
            this.opCodes[opCode.toNumber()].logic(data);
            //TODO: do something with the cycles
        } else {
            throw new Error(`Opcode ${opCode} does not exist!`);
        }
    }
}
