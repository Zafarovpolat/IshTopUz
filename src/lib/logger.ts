/**
 * Dev-only logger. В production всё, кроме warn/error, игнорируется,
 * чтобы не утекали userId / email / внутреннее состояние.
 */
const isDev = process.env.NODE_ENV !== 'production';

type LogFn = (...args: unknown[]) => void;

export const logger: {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
} = {
  debug: isDev ? (...a) => console.log(...a) : () => {},
  info: isDev ? (...a) => console.log(...a) : () => {},
  warn: (...a) => console.warn(...a),
  error: (...a) => console.error(...a),
};
