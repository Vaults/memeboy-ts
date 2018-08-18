import {Byte} from './byte';
import {CPU} from './cpu';
import {DoubleByte} from './double-byte';
import {Memory} from './memory';
import {OpCodeRegistry} from './opcodes/op-code-registry';
import {AluOpCodeSupplier} from './opcodes/suppliers/alu-op-code-supplier';
import {ExtendedOpCodeSupplier} from './opcodes/suppliers/extended-op-code-supplier';
import {JumpOpCodeSupplier} from './opcodes/suppliers/jump-op-code-supplier';
import {LoadOpCodeSupplier} from './opcodes/suppliers/load-op-code-supplier';
import {MiscOpCodeSupplier} from './opcodes/suppliers/misc-op-code-supplier';
import {RegisterRegistry} from './register-registry';
import {Stack} from './stack';
import {GPU} from './video/gpu';
import {IRenderer} from './video/i-renderer';

export class GameboyClassic {

    private operational: boolean = false;

    private readonly cpu: CPU;
    private readonly gpu: GPU;
    private readonly memory: Memory;
    private readonly stack: Stack;
    private readonly registerRegistry: RegisterRegistry;
    private readonly opcodeRegistry: OpCodeRegistry;
    private readonly renderer: IRenderer;
    private readonly cartridge: Byte[];

    constructor(bootRom: Byte[], cartridge: Byte[], renderer: IRenderer) {
        this.cartridge = cartridge;
        this.memory = new Memory();
        this.memory.setRegion(DoubleByte.OF(0x0000), bootRom);
        this.memory.setRegion(DoubleByte.OF(0x0100), cartridge.slice(0x100, 0x3FFF));
        this.stack = new Stack(this.memory);
        this.registerRegistry = new RegisterRegistry();
        this.opcodeRegistry = new OpCodeRegistry(
            this.registerRegistry,
            this.memory,
            [new LoadOpCodeSupplier(), new AluOpCodeSupplier(), new JumpOpCodeSupplier(), new MiscOpCodeSupplier()],
            [new ExtendedOpCodeSupplier()]
        );
        this.opcodeRegistry.checkInitializedOpcodes();
        this.cpu = new CPU(this.memory, this.registerRegistry.PC, this.opcodeRegistry, this.registerRegistry);
        this.gpu = new GPU(this.memory, renderer);
        this.renderer = renderer;
    }

    public start() {
        this.operational = true;
        this.cpu.startGameboy();
    }

    public run() {
        this.memory.setRegion(DoubleByte.OF(0x0000), this.cartridge.slice(0x0, 0x100));
        this.cpu.run();
    }

    public stop() {
        this.operational = false;
    }
}
