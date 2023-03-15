import { createInterface, Interface } from 'node:readline';

async function prompt(message: string, rl?: Interface): Promise<string> {
  const readline =
    rl ??
    createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  return new Promise((res) => {
    readline.question(message, (answer) => {
      res(answer);
      readline.close();
    });
  });
}

type PromptOption<
  TValue,
  TKey extends keyof TValue
> = TValue[TKey] extends string
  ?
      | string
      | {
          message: string;
          coerce?: (answer: string) => TValue[TKey];
        }
  : {
      message: string;
      coerce: (answer: string) => TValue[TKey];
    };

type PromptOptions<TValue> = {
  [key in keyof TValue]: PromptOption<TValue, key>;
};

export async function incrediprompt<
  TValue extends Record<string, unknown> = Record<string, unknown>
>(options: PromptOptions<TValue>): Promise<TValue> {
  const response: Partial<TValue> = {};
  for (const key in options) {
    const opts = options[key];
    if (typeof opts === 'string') {
      response[key] = (await prompt(opts)) as TValue[typeof key];
    } else {
      // This cast is safe because coerce is required if TValue[key] is not a string.
      // TODO: Figure out how to get rid of this cast, it seems like typescript shouldn't require it.
      const coerce = opts.coerce ?? ((a) => a as TValue[typeof key]);
      response[key] = coerce(await prompt(opts.message));
    }
  }
  return response as TValue;
}
