import {Byte} from '../src/byte';
import {GameboyClassic} from '../src/gameboy-classic';
import {DEBUG} from '../src/lib/debug';
import {NodeFileReader} from './test-helpers/node-file-reader';
import {NullRenderer} from './test-helpers/null-renderer';

describe('starts without errors', () => {
    let gameboy: GameboyClassic;

    beforeAll((done) => {
        new NodeFileReader().getBootRom((bootRom: Byte[]) => {
            new NodeFileReader().getRom(undefined, (cartridge: Byte[]) => {
                DEBUG.LEVEL = 'INFO';
                gameboy = new GameboyClassic(bootRom, cartridge, new NullRenderer());
                done();
            });
        });
    });

   it('does', () => {
       gameboy.start();
       gameboy.stop();
   });
});
