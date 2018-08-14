import {GPU} from './gpu';
import {Byte} from '../byte';

export interface IRenderer {
    render(screen: number[][]): void;
}