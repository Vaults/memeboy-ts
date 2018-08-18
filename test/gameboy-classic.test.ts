import {GameboyClassic} from '../src/gameboy-classic';
import {NodeFileReader} from './test-helpers/node-file-reader';
import {Byte} from '../src/byte';
import {NullRenderer} from './test-helpers/null-renderer';
import {DEBUG} from '../src/lib/debug';
import {range} from '../src/lib/util';

describe('starts without errors', () => {
   it('does', done => {
       new NodeFileReader().getBootRom((bootRom: Byte[]) => {
           new NodeFileReader().getRom(undefined, (cartridge: Byte[]) => {
               DEBUG.LEVEL = 'INFO';
               const gb = new GameboyClassic(bootRom, cartridge, new NullRenderer());
               gb.start();
               gb.stop();
               done();
           });
       });
   });
});
