import { BigONotationPipe } from './big-o-notation.pipe';

describe('BigONotationPipe', () => {
  it('create an instance', () => {
    const pipe = new BigONotationPipe();
    expect(pipe).toBeTruthy();
  });
});
