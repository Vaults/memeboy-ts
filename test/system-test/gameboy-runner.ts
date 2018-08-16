import {Byte} from '../../src/byte';
import {GameboyClassic} from '../../src/gameboy-classic';
import {NodeFileReader} from '../test-helpers/node-file-reader';
import {ConsoleRenderer} from './console-renderer';
import {DEBUG} from '../../src/lib/debug';
import {NullRenderer} from '../test-helpers/null-renderer';
import {numberToHex} from '../../src/lib/util';

const nodeFileReader = new NodeFileReader();
const debug = process.argv[3] === 'DEBUG';


nodeFileReader.getBootRom((bootRom: Byte[]) => {
    nodeFileReader.getRom(process.argv[2], (cartridge: Byte[]) => {
        DEBUG.LEVEL = (debug) ? 'INFO' : 'OFF';
        const gb = new GameboyClassic(bootRom, cartridge, (debug) ? new NullRenderer() :  new ConsoleRenderer());
        gb.start();
    })

});