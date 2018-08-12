import {IRenderer} from '../../src/video/i-renderer';
import {GPU} from '../../src/video/gpu';

export class NullRenderer implements IRenderer {
    render(): void { }

    setGpu(gpu: GPU): void {
        gpu.getScreen();
    }

}
