import {Byte} from '../src/byte';

describe('constructor', () => {
  // TODO
  it('number', () => {
    expect(new Byte(255).getBit(1).val()).toBe(1);
  });
});