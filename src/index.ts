import EslintPlugin from './plugins/eslint-plugin/index';
import CommitMessagePlugin from './plugins/commit-message-plugin';
import CommitMessageCheckPlugin from './plugins/commit-message-check-plugin';
import Core from './core';
import { PluginRecord } from './constants';

// 安装插件
Core.install(PluginRecord.EslintPlugin, (core: Core) => {
  core[PluginRecord.EslintPlugin] = new EslintPlugin(core);
});
Core.install(PluginRecord.CommitMessagePlugin, (core: Core) => {
  core[PluginRecord.CommitMessagePlugin] = new CommitMessagePlugin(core);
});
Core.install(PluginRecord.CommitMessageCheckPlugin, (core: Core) => {
  core[PluginRecord.CommitMessageCheckPlugin] = new CommitMessageCheckPlugin(core);
});

export default Core;
