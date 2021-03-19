import { PluginRecord } from './constants';

class GhCore implements GhCore {
  static pluginRecord: Record<string, GhPlugin>;
  static install(name: string, plugin: GhPlugin) {
    if (!GhCore.pluginRecord) {
      GhCore.pluginRecord = {};
    }
    GhCore.pluginRecord[name] = plugin;
  }

  config: GhConfig;
  logger: Logger;
  /**
   * @description 最终使用的插件列表
   */
  pluginList: string[];
  [key: string]: any;

  constructor(config?: GhConfig) {
    this.config = config || {};
    this.logger = {
      log: console.log,
      warn: console.log,
      error: console.log,
    };
    this.pluginList = Object.keys(GhCore.pluginRecord) || [];
    this.pluginRecordCall();
  }

  /**
   * @description 将安装上的插件混入到core中
   */
  pluginRecordCall() {
    if (GhCore.pluginRecord) {
      const defaultPluginList = [
        PluginRecord.CommitMessagePlugin,
        PluginRecord.LoggerPlugin,
        PluginRecord.CommitMessageCheckPlugin,
      ];
      // 如果黑名单存在，就要将默认内置的插件和不在黑名单中的插件筛选出来
      if (this.config.blackList) {
        this.pluginList = this.pluginList.filter(
          (plugin) => defaultPluginList.includes(plugin) || !this.config.blackList?.includes(plugin)
        );
      }
      // 如果白名单存在，就要将默认内置的插件和在白名单中的插件筛选出来
      if (this.config.whiteList) {
        this.pluginList = this.pluginList.filter(
          (plugin) => defaultPluginList.includes(plugin) || this.config.whiteList?.includes(plugin)
        );
      }
      this.pluginList.forEach((name) => {
        let plugin = GhCore.pluginRecord[name];
        plugin.call(this, this);
      });
    }
  }
}

export default GhCore;
