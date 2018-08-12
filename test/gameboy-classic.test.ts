import {GameboyClassic} from '../src/gameboy-classic';
import {NodeFileReader} from './test-helpers/node-file-reader';
import {Byte} from '../src/byte';
import {NullRenderer} from './test-helpers/null-renderer';

describe('starts without errors', () => {
   it('does', done => {
       new NodeFileReader().getBootRom((bytes: Byte[]) => {
           const gb = new GameboyClassic(bytes, new NullRenderer());
           gb.start();
           gb.stop();
           done();
       });
   });
});
