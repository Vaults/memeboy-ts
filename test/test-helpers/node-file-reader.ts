import * as fs from 'fs';
import {Byte} from '../../src/byte';

export class NodeFileReader {

    private static BOOT_ROM_LOCATION: string = 'roms/bootstrap/DMG_ROM.gb';

    constructor(){ }

    public getBootRom(callback: (bytes: Byte[]) => void ) {
        fs.readFile(NodeFileReader.BOOT_ROM_LOCATION, (err, data) => {
            if (err) {throw err; }
            callback(data.toString('hex').split('').map(i => parseInt(i, 16)).map(i => Byte.OF(i)));
        })
    }
}