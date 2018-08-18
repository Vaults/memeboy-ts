export class DEBUG {

    public static LEVEL: string = 'INFO';

    private static levels: string[] = [
        'INFO',
        'WARN',
        'ERR',
        'OFF'
    ];

    public static INFO(s: string) {
        if (this.comparePrecedence('INFO')) {
            //We do want to use console here, it is a logger
            // tslint:disable-next-line
            console.log(s);
        }
    }

    public static WARN(s: string) {
        if (this.comparePrecedence('WARN')) {
            console.warn(s);
        }
    }

    public static ERR(s: string) {
        if (this.comparePrecedence('ERR')) {
            //We do want to use console here, it is a logger
            // tslint:disable-next-line
            console.error(s);
        }
    }

    private static comparePrecedence(desired: string): boolean {
        return this.levels.indexOf(desired) >= this.levels.indexOf(this.LEVEL);
    }
}
