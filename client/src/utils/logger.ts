import { config } from '../config/environment';

export const logger = {
  log: (...args: any[]) => {
    if (config.enableConsoleLogs) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (config.enableConsoleLogs) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (config.enableConsoleLogs) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (config.enableConsoleLogs) {
      console.info(...args);
    }
  }
};