import * as z from "zod";

export const jsonCodec = <T extends z.core.$ZodType>(schema: T) =>
  z.codec(z.string(), schema, {
    decode: (jsonString, ctx) => {
      try {
        return JSON.parse(jsonString);
      } catch (err: unknown) {
        if (err instanceof Error) {
          ctx.issues.push({
            code: "invalid_format",
            format: "json",
            input: jsonString,
            message: err.message,
          });
          return z.NEVER;
        }
        return z.NEVER;
      }
    },
    encode: (value) => JSON.stringify(value),
  });
