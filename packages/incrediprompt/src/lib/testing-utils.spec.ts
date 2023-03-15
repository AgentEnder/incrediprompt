import type { Interface } from 'node:readline';
import * as rl from 'node:readline';

export function provideMockReadlineInterfaceOnce(
  prompts: Record<string, string>
) {
  return jest
    .spyOn(rl, 'createInterface')
    .mockImplementationOnce(() => createMockReadlineInterface(prompts));
}

export function createMockReadlineInterface(
  prompts: Record<string, string>
): Interface {
  return {
    close: jest.fn(),
    question: jest.fn().mockImplementation((message, cb) => {
      if (prompts[message]) {
        cb(prompts[message]);
      }
      throw new Error('Unexpected prompt:' + message);
    }),
  } as Partial<Interface> as Interface;
}
