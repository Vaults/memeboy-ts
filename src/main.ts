import {CPU} from './cpu';
import {Memory} from './memory';
import {Stack} from './stack';

export class Main {
    constructor(){
        const memory: Memory = new Memory();
        const stack: Stack = new Stack(memory);
        const cpu: CPU = new CPU(memory, stack);
    }
}