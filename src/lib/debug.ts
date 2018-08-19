export class DEBUG {

    public static LEVEL: string = 'INFO';

    private static levels: string[] = [
        'INFO',
        'WARN',
        'ERR',
        'OFF'
    ];

    public static INFO<T>(obj: T) {
        if (this.comparePrecedence('INFO')) {
            //We do want to use console here, it is a logger
            // tslint:disable-next-line
            console.log(obj.toString());
        }
    }

    public static WARN<T>(obj: T) {
        if (this.comparePrecedence('WARN')) {
            console.warn(obj.toString());
        }
    }

    public static ERR<T>(obj: T) {
        if (this.comparePrecedence('ERR')) {
            //We do want to use console here, it is a logger
            // tslint:disable-next-line
            console.error(obj.toString());
        }
    }

    private static comparePrecedence(desired: string): boolean {
        return this.levels.indexOf(desired) >= this.levels.indexOf(this.LEVEL);
    }
}
