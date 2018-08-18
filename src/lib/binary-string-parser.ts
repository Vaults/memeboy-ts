import {Byte} from '../byte';

export class BinaryStringParser {
    public static PARSE(s: Buffer): Byte[] {
        return s.toString('hex').match(/.{1,2}/g).map(i => parseInt(i, 16)).map(i => Byte.OF(i));
    }
}
