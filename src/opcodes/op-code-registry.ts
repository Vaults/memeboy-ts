import {ALU} from '../alu';
import {Bit} from '../bit';
import {Byte} from '../byte';
import {DoubleByte} from '../double-byte';
import {DEBUG} from '../lib/debug';
import {numberToHex, range} from '../lib/util';
import {Memory} from '../memory';
import {RegisterRegistry} from '../register-registry';
import {Stack} from '../stack';
import {OpCode, OpCodeLogic} from './op-code';

export class OpCodeRegistry {
    public readonly opCodes: {[key: number] : OpCode} = {};
    public readonly extendedOpCodes: {[key: number] : OpCode} = {};

    private readonly registerRegistry: RegisterRegistry;
    private readonly memory: Memory;
    private readonly stack: Stack;
    private readonly alu: ALU;

    constructor(registerRegistry: RegisterRegistry, memory: Memory){
        this.registerRegistry = registerRegistry;
        this.memory = memory;
    }

    private add(byte: number, logic: OpCodeLogic, cycles: number, dataBytes?: number){
        if (this.opCodes[byte] !== undefined) {
            throw new Error(`OPCODE NUMBER ${numberToHex(byte)} DEFINED TWICE!`);
        }
        this.opCodes[byte] = new OpCode(logic, cycles, dataBytes);
    }

    private addExt(byte: number, logic: OpCodeLogic, cycles: number, dataBytes?: number){
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

    public getOpCode(b: Byte) {
        const opCode: OpCode = this.opCodes[b.toNumber()];
        if (opCode) {
            return this.opCodes[b.toNumber()];
        } else {
            throw new Error(`Opcode ${numberToHex(b.toNumber())} does not exist!`);
        }
    }

    public getExtendedOpCode(b: Byte) {
        const opCode: OpCode = this.extendedOpCodes[b.toNumber()];
        if (opCode) {
            return this.extendedOpCodes[b.toNumber()];
        } else {
            throw new Error(`Extended Opcode ${numberToHex(b.toNumber())} does not exist!`);
        }
    }

    private initializeOpcodesLoad() {
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

    private initializeOpcodesExtended() {
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

        //RLA TODO move
        this.add(0x17, (r, m, s, a, d) => {
            RL(r.A)(r,m,s,a,d);

            r.FZ.setState(0);
            r.FH.setState(0);
            r.FN.setState(0);
        }, 8);



        const order: Byte[] = [
            this.registerRegistry.B,
            this.registerRegistry.C,
            this.registerRegistry.D,
            this.registerRegistry.E,
            this.registerRegistry.H,
            this.registerRegistry.L,
            null,
            this.registerRegistry.A
        ];
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
                this.addExt(0x10 + row, RL(byte), 8);
                this.addExt(0x20 + row, RR(byte), 8);
                this.addExt(0x30 + row, SWAP(byte), 8);
            }

            this.addExt(0x40 + row * 8 + 6, (r, m, s, a, d) => BIT(m.getWord(r.HL), row)(r,m,s,a,d), 8);
            this.addExt(0x80 + row * 8 + 6, (r, m, s, a, d) => BIT(m.getWord(r.HL), row)(r,m,s,a,d), 8);
            this.addExt(0xC0 + row * 8 + 6, (r, m, s, a, d) => BIT(m.getWord(r.HL), row)(r,m,s,a,d), 8);
        });

        this.addExt(0x16, (r, m, s, a, d) => RL(m.getWord(r.HL))(r,m,s,a,d), 8);
        this.addExt(0x26, (r, m, s, a, d) => RR(m.getWord(r.HL))(r,m,s,a,d), 8);
        this.addExt(0x36, (r, m, s, a, d) => SWAP(m.getWord(r.HL))(r,m,s,a,d), 8);

    }

    private initializeOpcodesJump() {
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
        this.add(0xDC, wrapNZ(jump), 12, 2);

        //RET
        this.add(0xC9, (r, m, s, a, d) => {
            r.PC.copy(s.popDouble());
            r.PC.decrement();
        }, 8);
    }
}
