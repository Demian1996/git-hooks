/*
 * @Author: wangdengzhi
 * @Date: 2021-03-12 11:01:39
 * @Last Modified by: wangdengzhi
 * @Last Modified time: 2021-03-19 14:43:57
 * @Description: 自定义Commit信息插件
 * 纯工具式插件，无需提供责任链接口
 */
import GhCore from '../../core';
import fs from 'fs';
import { PluginRecord } from '../../constants';

class CommitMessagePlugin {
  name = PluginRecord.CommitMessagePlugin;
  /**
   * @description 插件核心
   */
  core: GhCore;
  /**
   * @description 当前commit信息的存放地址
   */
  commitMsgStoragePath: string;

  constructor(core: GhCore) {
    this.core = core;
    this.commitMsgStoragePath = '';
  }

  setCommitMsgStoragePath(path: string) {
    this.commitMsgStoragePath = path;
  }

  /**
   * @description 读取commit信息
   */
  readCommitMessage() {
    if (!this.commitMsgStoragePath) {
      throw new Error('没有设置commit存放路径!');
    }
    return fs.readFileSync(this.commitMsgStoragePath, 'utf8');
  }

  /**
   * @description 修改commit信息
   */
  writeCommitMessage(message: string) {
    fs.writeFileSync(this.commitMsgStoragePath, message);
  }
}

export default CommitMessagePlugin;
