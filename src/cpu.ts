import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {OpCodeRegistry} from './opcodes/op-code-registry';
import {OpCode} from './opcodes/op-code';

export class CPU {

    private static readonly EXTENDED_OPS: number = 0xCB;

    private bootRom: Byte[];
    private opCodeRegistry: OpCodeRegistry;

    constructor(opCodeRegistry: OpCodeRegistry, bootRom: Byte[]) {
        this.opCodeRegistry = opCodeRegistry;
        this.bootRom = bootRom;
    }

    public executeBootRom() {
        while (this.bootRom.length > 0) {
            const nextByte = this.bootRom.pop();
            if (nextByte.toNumber() !== CPU.EXTENDED_OPS){
                const opCode: OpCode = this.opCodeRegistry.getOpCode(nextByte);
                if (opCode.dataBytes === 0) {
                    opCode.logic();
                } else if (opCode.dataBytes === 1) {
                    opCode.logic(this.bootRom.pop());
                } else {
                    opCode.logic(new DoubleByte(this.bootRom.pop(), this.bootRom.pop()));
                }
            } else {
                const extOpCode: OpCode = this.opCodeRegistry.getExtendedOpCode(this.bootRom.pop());
                extOpCode.logic(this.bootRom.pop());
            }
        }
    }


    private halt(): void {

    }

    private stop(): void {

    }

    private disableInterrupts() {

    }

    private enableInterrupts() {

    }


}
