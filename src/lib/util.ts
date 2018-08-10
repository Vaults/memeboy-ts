function padZero(s: string, l: number): string {
    return ('0'.repeat(l) + s).slice(-l);
}

export {padZero}