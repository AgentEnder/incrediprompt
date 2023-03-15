import { incrediprompt } from './incrediprompt';

import { provideMockReadlineInterfaceOnce } from './testing-utils.spec';

describe('incrediprompt', () => {
  it('should work for string type prompts', async () => {
    provideMockReadlineInterfaceOnce({
      'Whats the answer?': 'foobar',
    });
    expect(
      // TODO: Figure out why we have to provide the generic here, improve typescript inference.
      await incrediprompt<{ answer: string }>({
        answer: 'Whats the answer?',
      })
    ).toEqual({ answer: 'foobar' });
  });

  it('should coerce types', async () => {
    provideMockReadlineInterfaceOnce({
      'Whats the answer?': 'false',
    });
    expect(
      await incrediprompt({
        answer: { message: 'Whats the answer?', coerce: (c) => c === 'true' },
      })
    ).toEqual({ answer: false });
  });
});
