import * as fs from 'fs';
import {Byte} from '../../src/byte';

export class NodeFileReader {

    private static BOOT_ROM_LOCATION: string = 'roms/bootstrap/DMG_ROM.gb';

    constructor() { }

    public getBootRom(callback: (bytes: Byte[]) => void ) {
        fs.readFile(NodeFileReader.BOOT_ROM_LOCATION, (err, data) => {
            if (err) {throw err; }
            const bytes = data.toString('hex').match(/.{1,2}/g).map(i => parseInt(i, 16)).map(i => Byte.OF(i));
            callback(bytes);
        })
    }
}