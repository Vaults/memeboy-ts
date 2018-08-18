import {ALU} from '../alu';
import {Byte} from '../byte';
import {DoubleByte} from '../double-byte';
import {numberToHex, range} from '../lib/util';
import {Memory} from '../memory';
import {RegisterRegistry} from '../register-registry';
import {Stack} from '../stack';
import {OpCode} from './op-code';
import {Bit} from '../bit';
import {DEBUG} from '../lib/debug';

export class OpCodeRegistry {
    public readonly opCodes: {[key: number] : OpCode} = {};
    public readonly extendedOpCodes: {[key: number] : OpCode} = {};

    private readonly r: RegisterRegistry;
    private readonly m: Memory;
    private readonly stack: Stack;
    private readonly alu: ALU;

    constructor(r: RegisterRegistry, m: Memory){
        this.r = r;
        this.m = m;
        this.stack = new Stack(m);
        this.alu = new ALU(this.r);
    }

    private add(byte: number, logic: (data?: Byte | DoubleByte) => void, cycles: number, dataBytes?: number){
        if (this.opCodes[byte] !== undefined) {
            throw new Error(`OPCODE NUMBER ${numberToHex(byte)} DEFINED TWICE!`);
        }
        this.opCodes[byte] = new OpCode(logic, cycles, dataBytes);
    }

    private addExt(byte: number, logic: (data?: Byte | DoubleByte) => void, cycles: number, dataBytes?: number){
        if (this.extendedOpCodes[byte] !== undefined) {
            throw new Error(`EXT OPCODE NUMBER ${numberToHex(byte)} DEFINED TWICE!`);
        }
        this.extendedOpCodes[byte] =  new OpCode(logic, cycles, dataBytes);
    }

    public initializeOpcodes(){
        //TODO: FLAG LOGIC

        this.initializeOpcodesLoad();
        this.initializeOpcodesAlu();
        this.initializeOpcodesJump();
        this.initializeOpcodesExtended();

        //PUSH nn
        this.add(0xF5, () => this.stack.pushDouble(new DoubleByte(this.r.A, this.r.F)), 16);
        this.add(0xC5, () => this.stack.pushDouble(this.r.BC), 16);
        this.add(0xD5, () => this.stack.pushDouble(this.r.DE), 16);
        this.add(0xE5, () => this.stack.pushDouble(this.r.HL), 16);

        //POP nn
        this.add(0xF1, () => this.r.AF.copy(this.stack.popDouble()), 12);
        this.add(0xC1, () => this.r.BC.copy(this.stack.popDouble()), 12);
        this.add(0xD1, () => this.r.DE.copy(this.stack.popDouble()), 12);
        this.add(0xE1, () => this.r.HL.copy(this.stack.popDouble()), 12);


        //this.add HL,n
        this.add(0x09, () => { /* TODO */ }, 8);
        this.add(0x19, () => { /* TODO */ }, 8);
        this.add(0x29, () => { /* TODO */ }, 8);
        this.add(0x39, () => { /* TODO */ }, 8);

        //this.add SP,n
        this.add(0xE8, () => { /* TODO */ }, 16);

        //INC nn
        this.add(0x03, () => this.r.BC.increment(), 8);
        this.add(0x13, () => this.r.DE.increment(), 8);
        this.add(0x23, () => this.r.HL.increment(), 8);
        this.add(0x33, () => this.stack.increment(), 8);

        //DEC nn
        this.add(0x0B, () => this.r.BC.decrement(), 8);
        this.add(0x1B, () => this.r.DE.decrement(), 8);
        this.add(0x2B, () => this.r.HL.decrement(), 8);
        this.add(0x3B, () => this.stack.decrement(), 8);


        //DAA
        this.add(0x27, () => {/* TODO */}, 4);

        //CPL
        this.add(0x2F, () => this.r.A.flip(), 4);

        //CCF
        this.add(0x3F, () => this.r.FC.flip(), 4);

        //SCF
        this.add(0x37, () => this.r.FC.setState(0), 4);

        //NOP
        this.add(0x00, () => {}, 4);

        //HALT
        this.add(0x76, () => {/* TODO */}, 4);

        //STOP
        this.add(0x10, () => {/* TODO */}, 4);

        //DI
        this.add(0xF3, () => {/* TODO */}, 4);

        //EI
        this.add(0xFB, () => {/* TODO */}, 4);

        //RRCA
        this.add(0x0F, () => {
            this.r.FC.copy(this.r.A.getBit(0));
            this.r.A.rotate(1);
        }, 4);

        //RLCA
        this.add(0x07, () => {
            this.r.FC.copy(this.r.A.getBit(7));
            this.r.A.rotate(-1);
        }, 4);

        const checkInitialized = (opCodes: {[key: number] : OpCode}, iden: string) => {
            if (Object.keys(opCodes).length !== 255) {
                const numbers = range(0, 256).filter(i => opCodes[i] === undefined);
                const numberList = numbers.map(i => numberToHex(i)).join(',');
                const message: string = `Not all ${iden}opcodes were initialized (missing ${numbers.length})!\n Missing ${iden}opcodes: ${numberList}`;
                DEBUG.WARN(message);
            }
        };

        checkInitialized(this.opCodes, '');
        checkInitialized(this.extendedOpCodes, 'extended');

    }

    private initializeOpcodesAlu() {
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

        const funcList: ((b: Byte) => void)[] = [
            b => this.alu.add(b),
            b => this.alu.sub(b),
            b => this.alu.adc(b),
            b => this.alu.sbc(b),
            b => this.alu.and(b),
            b => this.alu.or(b),
            b => this.alu.xor(b),
            b => this.alu.cp(b),
            b => this.alu.inc(b),
            b => this.alu.dec(b),
        ];

        Object.keys(aluMap).forEach((key: string) => {
            if (key !== '_NUM') {
                funcList.forEach(((func: (b: Byte) => void, index: number) => {
                    const tuple: number[] = aluMap[key][index];
                    this.add(tuple[0], () => {
                        let value: Byte;
                        if (key === '_HL') {
                            value = this.m.getWord(this.r.HL);
                        } else {
                            // @ts-ignore
                            value = this.r[key];
                        }
                        func(value);
                    }, tuple[1]);
                }));
            } else {
                funcList.forEach(((func: (b: Byte) => void, index: number) => {
                    const tuple: number[] = aluMap[key][index];
                    if(tuple !== null) {
                        this.add(tuple[0], (b: Byte) => func(b), tuple[1], 1);
                    }
                }));
            }
        });
    }

    public getOpCode(b: Byte){
        const opCode: OpCode = this.opCodes[b.toNumber()];
        if (opCode) {
            return this.opCodes[b.toNumber()];
        } else {
            throw new Error(`Opcode ${numberToHex(b.toNumber())} does not exist!`);
        }
    }

    public getExtendedOpCode(b: Byte){
        const opCode: OpCode = this.extendedOpCodes[b.toNumber()];
        if (opCode) {
            return this.extendedOpCodes[b.toNumber()];
        } else {
            throw new Error(`Extended Opcode ${numberToHex(b.toNumber())} does not exist!`);
        }
    }

    private initializeOpcodesLoad() {
        //LD nn,n
        this.add(0x06, (d: Byte) => this.r.B.copy(d), 8, 1);
        this.add(0x0E, (d: Byte) => this.r.C.copy(d), 8, 1);
        this.add(0x16, (d: Byte) => this.r.D.copy(d), 8, 1);
        this.add(0x1E, (d: Byte) => this.r.E.copy(d), 8, 1);
        this.add(0x26, (d: Byte) => this.r.H.copy(d), 8, 1);
        this.add(0x2E, (d: Byte) => this.r.L.copy(d), 8, 1);

        const ldMap: {[key: number] : [Byte, Byte]} = {
            0x7F: [this.r.A, this.r.A], 0x78: [this.r.A, this.r.B], 0x79: [this.r.A, this.r.C], 0x7A: [this.r.A, this.r.D], 0x7B: [this.r.A, this.r.E], 0x7C: [this.r.A, this.r.H], 0x7D: [this.r.A, this.r.L],
            0x40: [this.r.B, this.r.B], 0x41: [this.r.B, this.r.C], 0x42: [this.r.B, this.r.D], 0x43: [this.r.B, this.r.E], 0x44: [this.r.B, this.r.H], 0x45: [this.r.B, this.r.L], 0x47: [this.r.B, this.r.A],
            0x48: [this.r.C, this.r.B], 0x49: [this.r.C, this.r.C], 0x4A: [this.r.C, this.r.D], 0x4B: [this.r.C, this.r.E], 0x4C: [this.r.C, this.r.H], 0x4D: [this.r.C, this.r.L], 0x4F: [this.r.C, this.r.A],
            0x50: [this.r.D, this.r.B], 0x51: [this.r.D, this.r.C], 0x52: [this.r.D, this.r.D], 0x53: [this.r.D, this.r.E], 0x54: [this.r.D, this.r.H], 0x55: [this.r.D, this.r.L], 0x57: [this.r.D, this.r.A],
            0x58: [this.r.E, this.r.B], 0x59: [this.r.E, this.r.C], 0x5A: [this.r.E, this.r.D], 0x5B: [this.r.E, this.r.E], 0x5C: [this.r.E, this.r.H], 0x5D: [this.r.E, this.r.L], 0x5F: [this.r.E, this.r.A],
            0x60: [this.r.H, this.r.B], 0x61: [this.r.H, this.r.C], 0x62: [this.r.H, this.r.D], 0x63: [this.r.H, this.r.E], 0x64: [this.r.H, this.r.H], 0x65: [this.r.H, this.r.L], 0x67: [this.r.H, this.r.A],
            0x68: [this.r.L, this.r.B], 0x69: [this.r.L, this.r.L], 0x6A: [this.r.L, this.r.D], 0x6B: [this.r.L, this.r.E], 0x6C: [this.r.L, this.r.H], 0x6D: [this.r.L, this.r.L], 0x6F: [this.r.L, this.r.A],
        };

        Object.keys(ldMap).map(i => parseInt(i, 10)).forEach((key: number) => {
            const ldMapElement : [Byte, Byte] = ldMap[key];
            this.add(key, () => ldMapElement[0].copy(ldMapElement[1]), 4);
        });

        //LD r1,r2
        this.add(0x7E, () => this.r.A.copy(this.m.getWord(this.r.HL)), 8);
        this.add(0x46, () => this.r.B.copy(this.m.getWord(this.r.HL)), 8);
        this.add(0x4E, () => this.r.C.copy(this.m.getWord(this.r.HL)), 8);
        this.add(0x56, () => this.r.D.copy(this.m.getWord(this.r.HL)), 8);
        this.add(0x5E, () => this.r.E.copy(this.m.getWord(this.r.HL)), 8);
        this.add(0x66, () => this.r.H.copy(this.m.getWord(this.r.HL)), 8);
        this.add(0x6E, () => this.r.L.copy(this.m.getWord(this.r.HL)), 8);

        this.add(0x70, () => this.m.setWord(this.r.HL, this.r.B), 4);
        this.add(0x71, () => this.m.setWord(this.r.HL, this.r.C), 4);
        this.add(0x72, () => this.m.setWord(this.r.HL, this.r.D), 4);
        this.add(0x73, () => this.m.setWord(this.r.HL, this.r.E), 4);
        this.add(0x74, () => this.m.setWord(this.r.HL, this.r.H), 4);
        this.add(0x75, () => this.m.setWord(this.r.HL, this.r.L), 4);
        this.add(0x36, (data: Byte) => this.m.setWord(this.r.HL, data), 8, 1);

        //LD A,n
        this.add(0x0A, () => this.r.A.copy(this.m.getWord(this.r.BC)), 8);
        this.add(0x1A, () => this.r.A.copy(this.m.getWord(this.r.DE)), 8);
        this.add(0xFA, (data: DoubleByte) => this.r.A.copy(this.m.getWord(data)), 16, 2);
        this.add(0x3E, (data: Byte) => this.r.A.copy(data), 8, 1);

        //LD n,A
        this.add(0x02, () => this.m.setWord(this.r.BC, this.r.A), 8);
        this.add(0x12, () => this.m.setWord(this.r.DE, this.r.A), 8);
        this.add(0x77, () => this.m.setWord(this.r.HL, this.r.A), 8);
        this.add(0xEA, (data: DoubleByte) => this.m.setWord(data, this.r.A), 16, 2);

        //LD A,(C)
        // @ts-ignore
        this.add(0xF2, () => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(this.r.C);
            this.r.A.copy(this.m.getWord(loc))
        }, 8);
        // @ts-ignore
        this.add(0xE2, () => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(this.r.C);
            this.m.setWord(loc, this.r.A)
        }, 8);

        //LDA,(HLD), LD A,(HL-), LDD A,(HL) and reverse
        this.add(0x3A, () => { this.r.A.copy(this.m.getWord(this.r.HL)); this.r.HL.decrement(); }, 8);
        this.add(0x32, () => { this.m.setWord(this.r.HL, this.r.A); this.r.HL.decrement(); }, 8);

        //LDA,(HLI), LD A,(HL+), LDD A,(HL) and reverse
        this.add(0x2A, () => { this.r.A.copy(this.m.getWord(this.r.HL)); this.r.HL.increment(); }, 8);
        this.add(0x22, () => { this.m.setWord(this.r.HL, this.r.A); this.r.HL.increment(); }, 8);
        //LDH (n),A
        this.add(0xE0, (data: Byte) => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(data);
            this.m.setWord(loc, this.r.A);
        }, 12, 1);
        this.add(0xF0, (data: Byte) => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(data);
            this.r.A.copy(this.m.getWord(loc));
        }, 12, 1);

        //LDH (C),A
        this.add(0xE3, () => {
            const loc = DoubleByte.OF(0xFF00);
            loc.add(this.r.C);
            this.r.A.copy(this.m.getWord(loc));
            }, 12);

        //LD n,nn
        this.add(0x01, (data: DoubleByte) => this.r.BC.copy(data), 12, 2);
        this.add(0x11, (data: DoubleByte) => this.r.DE.copy(data), 12, 2);
        this.add(0x21, (data: DoubleByte) => this.r.HL.copy(data), 12, 2);
        this.add(0x31, (data: DoubleByte) => this.stack.setPointer(data), 12, 2);

        //LD SP,HL
        this.add(0xF9, () => this.stack.setPointer(this.r.HL), 8);

        //LD HL,SP+n
        this.add(0xF8, () => {} /*TODO*/, 12);

        //LD (nn),SP
        this.add(0x08, (data: DoubleByte) => this.stack.pushDouble(data), 20, 2);
    }

    private initializeOpcodesExtended() {
        const BIT = (byte: Byte, index: number) => () => {
            //TODO neatify
            if(byte.getBit(7- index).isSet()){
                this.r.FZ.setState(0);
            } else {
                this.r.FZ.setState(1);
            }
            this.r.FN.setState(0);
            this.r.FH.setState(1);
        };
        const SET = (byte: Byte, index: number) => () => byte.getBit(7 - index).setState(1);
        const RES = (byte: Byte, index: number) => () => byte.getBit(7 - index).setState(0);
        const RL = (byte: Byte) => {
            const temp: Bit = Bit.RANDOM();
            temp.copy(this.r.FC);

            this.r.FC.copy(byte.getBit(0));
            byte.rotate(-1);
            byte.getBit(7).copy(temp);
            //TODO: fix hack (bit updates do not trigger byte)
            byte.flip();
            byte.flip();

            this.r.checkZero(byte);
            this.r.FN.setState(0);
            this.r.FH.setState(0);
        };
        const RR = (byte: Byte) => {
            const temp: Bit = Bit.RANDOM();
            temp.copy(this.r.FC);

            this.r.FC.copy(byte.getBit(7));
            byte.rotate(1);
            byte.getBit(0).copy(temp);
            //TODO: fix hack (bit updates do not trigger byte)
            byte.flip();
            byte.flip();

            this.r.checkZero(byte);
            this.r.FN.setState(0);
            this.r.FH.setState(0);
        };
        const SWAP = (byte: Byte) => {
            byte.swap();
        };

        //RLA TODO move
        this.add(0x17, () => {
            RL(this.r.A);

            this.r.FZ.setState(0);
            this.r.FH.setState(0);
            this.r.FN.setState(0);
        }, 8);



        const order: Byte[] = [this.r.B, this.r.C, this.r.D, this.r.E, this.r.H, this.r.L, null, this.r.A];
        range(0, 8).forEach(row => {
            order.forEach((byte: Byte, col: number) => {
                if (byte !== null) {
                    this.addExt(0x40 + row * 8 + col, BIT(byte, row), 8);
                    this.addExt(0x80 + row * 8 + col, SET(byte, row), 8);
                    this.addExt(0xC0 + row * 8 + col, RES(byte, row), 8);
                }
            });
            if (order[row] !== null) {
                const byte: Byte = order[row];
                this.addExt(0x10 + row, () => RL(byte), 8);
                this.addExt(0x20 + row, () => RR(byte), 8);
                this.addExt(0x30 + row, () => SWAP(byte), 8);
            }

            this.addExt(0x40 + row * 8 + 6, () => BIT(this.m.getWord(this.r.HL), row)(), 8);
            this.addExt(0x80 + row * 8 + 6, () => SET(this.m.getWord(this.r.HL), row)(), 8);
            this.addExt(0xC0 + row * 8 + 6, () => RES(this.m.getWord(this.r.HL), row)(), 8);
        });

        this.addExt(0x16, () => RL(this.m.getWord(this.r.HL)), 8);
        this.addExt(0x26, () => RR(this.m.getWord(this.r.HL)), 8);
        this.addExt(0x36, () => SWAP(this.m.getWord(this.r.HL)), 8);

    }

    private initializeOpcodesJump() {
        const wrapNZ = (d: Byte| DoubleByte, func: (d: Byte | DoubleByte) => void) => { if (!this.r.FZ.isSet()) { func(d); }};
        const wrapZ = (d: Byte| DoubleByte, func: (d: Byte | DoubleByte) => void) => { if (this.r.FZ.isSet()) { func(d); }};
        const wrapNC = (d: Byte| DoubleByte, func: (d: Byte | DoubleByte) => void) => { if (!this.r.FC.isSet()) { func(d); }};
        const wrapC = (d: Byte| DoubleByte, func: (d: Byte | DoubleByte) => void) => { if (this.r.FC.isSet()) { func(d); }};

        //JUMP NZ, Z, NC, C
        const jump = (d: Byte) => this.r.PC.addSigned(d);
        this.add(0x18, jump, 8,  1);
        this.add(0x20, (d: Byte) => wrapNZ(d, jump), 8, 1);
        this.add(0x28, (d: Byte) => wrapZ(d, jump), 8, 1);
        this.add(0x30, (d: Byte) => wrapNC(d, jump), 8, 1);
        this.add(0x38, (d: Byte) => wrapC(d, jump), 8, 1);

        //CALL nn
        const call = (d: DoubleByte) => {
            this.r.PC.increment();
            this.stack.pushDouble(this.r.PC);
            this.r.PC.copy(d);
            this.r.PC.decrement();
        };
        this.add(0xCD, call, 12, 2);

        //CALL cc,nn
        this.add(0xC4, (d: DoubleByte) => wrapNZ(d, call), 12, 2);
        this.add(0xCC, (d: DoubleByte) => wrapZ(d, call), 12, 2);
        this.add(0xD4, (d: DoubleByte) => wrapNC(d, call), 12, 2);
        this.add(0xDC, (d: DoubleByte) => wrapC(d, call), 12, 2);

        //RET
        this.add(0xC9, () => {
            this.r.PC.copy(this.stack.popDouble());
            this.r.PC.decrement();
        }, 8);
    }
}