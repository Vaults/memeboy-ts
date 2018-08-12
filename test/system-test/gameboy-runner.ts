import {Byte} from '../../src/byte';
import {GameboyClassic} from '../../src/gameboy-classic';
import {NodeFileReader} from '../test-helpers/node-file-reader';
import {ConsoleRenderer} from './console-renderer';

new NodeFileReader().getBootRom((bytes: Byte[]) => {
    const gb = new GameboyClassic(bytes, new ConsoleRenderer());
    gb.start();
});