import {IRenderer} from '../../src/video/i-renderer';
import {GPU} from '../../src/video/gpu';

export class ConsoleRenderer implements IRenderer{

    private colorMap : {[n: number]: string} = {
        0: `\x1b[48;5;118m `,
        1: '\x1b[48;5;46m ',
        2: '\x1b[48;5;40m ',
        3: '\x1b[48;5;34m '
    }

    private buf: string = '';


    public render(screen: number[][]): void {
        screen.forEach((numbers: number[]) => {
            this.buffer(`${numbers.map(i => this.colorMap[i]).join('')}\n`);
        })
        this.print();
    }

    private buffer(s: string){
        this.buf += s;
    }

    private print() {
        process.stdout.write(`\x1Bc\x1B[0f`);
        process.stdout.write(this.buf);
        this.buf = '';
    }

}