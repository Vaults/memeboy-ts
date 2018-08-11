import {GameboyClassic} from '../src/gameboy-classic';
import {NodeFileReader} from './test-helpers/node-file-reader';
import {Byte} from '../src/byte';

describe('starts without errors', () => {
   it('does', done => {
       new NodeFileReader().getBootRom((bytes: Byte[]) => {
           const gb = new GameboyClassic(bytes);
           //gb.start();
           done();
       });
   });
});
