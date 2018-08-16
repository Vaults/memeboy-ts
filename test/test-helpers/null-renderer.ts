import {IRenderer} from '../../src/video/i-renderer';
import {GPU} from '../../src/video/gpu';

export class NullRenderer implements IRenderer {
    public render(screen: number[][]): void { console.log(screen.length); }

}
