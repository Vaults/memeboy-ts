function padZero(s: string, l: number): string {
    return ('0'.repeat(l) + s).slice(Math.min(-l, -s.length));
}

function numberToHex(i: number, length: number = 2): string {
    return `0x${padZero(i.toString(16), length).toUpperCase()}`;
}

function trueModulo(i: number, mod: number) {
    return ((i % mod) + mod) % mod;
}

function range(n: number, m: number) {
    // Only case of not using array literals because we need one of a fixed size.
    // tslint:disable-next-line
    return new Array(m - n).fill('').map((_, i) => n + i);
}

function safeByteOverflow(n: number): number {
    return trueModulo(n, 256);
}

export {numberToHex, padZero, range, trueModulo, safeByteOverflow};
