import {CPU} from './cpu';
import {Memory} from './memory';
import {Stack} from './stack';
import {DoubleByte} from './double-byte';
import {Byte} from './byte';

export class GameboyClassic {
    private cpu: CPU;
    private memory: Memory;
    private stack: Stack;


    constructor(bootRom: Byte[]) {
        this.memory = new Memory();
        this.stack = new Stack(this.memory);
        this.cpu = new CPU(this.memory, this.stack, bootRom);
    }

    public start() {
        this.cpu.executeBootRom();
    }

    private startCartridge(): void {
        this.cpu.A.copy(Byte.OF(0x01));
        this.cpu.F.copy(Byte.OF(0xB0));
        this.cpu.BC.copy(DoubleByte.OF(0x0013));
        this.cpu.DE.copy(DoubleByte.OF(0x00D8));
        this.cpu.HL.copy(DoubleByte.OF(0x014D));
        this.memory.setWord(DoubleByte.OF(0xFF05), Byte.OF(0x00)) //TIMA
        this.memory.setWord(DoubleByte.OF(0xFF06), Byte.OF(0x00)) //TMA
        this.memory.setWord(DoubleByte.OF(0xFF07), Byte.OF(0x00)) //TAC
        this.memory.setWord(DoubleByte.OF(0xFF10), Byte.OF(0x80)) //NR10
        this.memory.setWord(DoubleByte.OF(0xFF11), Byte.OF(0xBF)) //NR11
        this.memory.setWord(DoubleByte.OF(0xFF12), Byte.OF(0xF3)) //NR12
        this.memory.setWord(DoubleByte.OF(0xFF14), Byte.OF(0xBF)) //NR14
        this.memory.setWord(DoubleByte.OF(0xFF16), Byte.OF(0x3F)) //NR21
        this.memory.setWord(DoubleByte.OF(0xFF17), Byte.OF(0x00)) //NR22
        this.memory.setWord(DoubleByte.OF(0xFF19), Byte.OF(0xBF)) //NR24
        this.memory.setWord(DoubleByte.OF(0xFF1A), Byte.OF(0x7F)) //NR30
        this.memory.setWord(DoubleByte.OF(0xFF1B), Byte.OF(0xFF)) //NR31
        this.memory.setWord(DoubleByte.OF(0xFF1C), Byte.OF(0x9F)) //NR32
        this.memory.setWord(DoubleByte.OF(0xFF1E), Byte.OF(0xBF)) //NR33
        this.memory.setWord(DoubleByte.OF(0xFF20), Byte.OF(0xFF)) //NR41
        this.memory.setWord(DoubleByte.OF(0xFF21), Byte.OF(0x00)) //NR42
        this.memory.setWord(DoubleByte.OF(0xFF22), Byte.OF(0x00)) //NR43
        this.memory.setWord(DoubleByte.OF(0xFF23), Byte.OF(0xBF)) //NR30
        this.memory.setWord(DoubleByte.OF(0xFF24), Byte.OF(0x77)) //NR50
        this.memory.setWord(DoubleByte.OF(0xFF25), Byte.OF(0xF1)) //NR51
        this.memory.setWord(DoubleByte.OF(0xFF40), Byte.OF(0x91)) //LCDC
        this.memory.setWord(DoubleByte.OF(0xFF42), Byte.OF(0x00)) //SCY
        this.memory.setWord(DoubleByte.OF(0xFF43), Byte.OF(0x00)) //SCX
        this.memory.setWord(DoubleByte.OF(0xFF45), Byte.OF(0x00)) //LYC
        this.memory.setWord(DoubleByte.OF(0xFF47), Byte.OF(0xFC)) //BGP
        this.memory.setWord(DoubleByte.OF(0xFF48), Byte.OF(0xFF)) //OBP0
        this.memory.setWord(DoubleByte.OF(0xFF49), Byte.OF(0xFF)) //OBP1
        this.memory.setWord(DoubleByte.OF(0xFF4A), Byte.OF(0x00)) //WY
        this.memory.setWord(DoubleByte.OF(0xFF4B), Byte.OF(0x00)) //WX
        this.memory.setWord(DoubleByte.OF(0xFFFF), Byte.OF(0x00)) //IE
    }

}