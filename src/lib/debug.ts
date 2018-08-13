export class DEBUG {

    public static LEVEL = 'INFO';

    private static levels = [
        'INFO',
        'WARN',
        'ERR',
        'OFF'
    ]

    public static INFO(s: string) {
        if (this.comparePrecedence('INFO')) {
            console.log(s);
        }
    }

    public static WARN(s: string){
        if (this.comparePrecedence('WARN')) {
            console.warn(s);
        }
    }

    public static ERR(s: string){
        if (this.comparePrecedence('ERR')) {
            console.error(s);
        }
    }

    private static comparePrecedence(desired: string): boolean{
        return this.levels.indexOf(desired) >= this.levels.indexOf(this.LEVEL);
    }
}