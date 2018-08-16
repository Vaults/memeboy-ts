import {GameboyClassic} from '../src/gameboy-classic';
import {NodeFileReader} from './test-helpers/node-file-reader';
import {Byte} from '../src/byte';
import {NullRenderer} from './test-helpers/null-renderer';
import {DEBUG} from '../src/lib/debug';
import {range} from '../src/lib/util';

const ninData =  [0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D,
    0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, 0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB,
    0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, 0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E];

describe('starts without errors', () => {
   it('does', done => {
       new NodeFileReader().getBootRom((bytes: Byte[]) => {
           DEBUG.LEVEL = 'INFO';
           const fakeCartridge = range(0, 0x104).map(_ => Byte.OF(0)).concat(ninData.map(i => Byte.OF(i))).concat(Byte.OF(0x100 - 0x19)).concat(range(0, 0x20).map(_ => Byte.OF(0)));
           const gb = new GameboyClassic(bytes, fakeCartridge, new NullRenderer());
           gb.start();
           gb.stop();
           done();
       });
   });
});
