import {GPU} from './gpu';
import {Byte} from '../byte';

export interface IRenderer {
    setGpu(gpu: GPU): void;
    render(): void;
}