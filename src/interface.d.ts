type GhPlugin = (core: any) => void;

interface GhConfig {
  /**
   * @description 插件白名单
   */
  whiteList?: string[];
  /**
   * @description 插件黑名单
   */
  blackList?: string[];
}

interface GhCore {
  pluginRecordCall: () => void;
  [key: string]: any;
}

interface Logger {
  log: Function;
  error: Function;
  warn: Function;
}
