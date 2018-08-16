import * as fs from 'fs';
import {Byte} from '../../src/byte';
import {numberToHex} from '../../src/lib/util';
import {BinaryStringParser} from '../../src/lib/binary-string-parser';

export class NodeFileReader {

    private static BOOT_ROM_LOCATION: string = 'roms/bootstrap/DMG_ROM.gb';

    constructor() { }

    public getBootRom(callback: (bytes: Byte[]) => void ) {
        this.getRom(NodeFileReader.BOOT_ROM_LOCATION, callback);
    }

    public getRom(path: string, callback: (bytes: Byte[]) => void ) {
        fs.readFile(path, (err, data) => {
            if (err) {throw err; }
            const bytes = BinaryStringParser.parse(data);
            callback(bytes);
        })
    }
}