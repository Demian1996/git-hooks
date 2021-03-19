/*
 * @Author: wangdengzhi
 * @Date: 2021-03-12 11:01:39
 * @Last Modified by: wangdengzhi
 * @Last Modified time: 2021-03-19 15:38:21
 * @Description: eslint插件
 */
import { PluginRecord } from '../../constants';
import GhCore from '../../core';
import process from 'process';

class EslintPlugin {
  name = PluginRecord.EslintPlugin;
  /**
   * @description 待检查文件列表
   */
  fileList: string[];
  /**
   * @description eslint错误数
   */
  errorCount: number;
  /**
   * @description eslint警告数
   */
  warningCount: number;
  /**
   * @description 插件核心
   */
  core: GhCore;
  /**
   * @description eslint检测后的结果集合
   */
  resultList: LintResult[];

  constructor(core: GhCore) {
    this.core = core;
    this.fileList = [];
    this.resultList = [];
    this.errorCount = 0;
    this.warningCount = 0;
  }

  setFileList(fileList: string[]) {
    this.fileList = fileList;
  }

  /**
   * @description 对文件进行语法检测
   */
  async lintFiles(eslint: any) {
    this.resultList = (await eslint.lintFiles(this.fileList)) as LintResult[];
    this.resultList.forEach((result) => {
      this.errorCount += result.errorCount;
      this.warningCount += result.warningCount;
    });
  }

  getResult() {
    this._outputLabelLine('ESLint Start');
    this.resultList.forEach((result) => {
      if (result.messages && result.messages.length > 0) {
        this.core.logger.error(`ESLint has found problems in file: ${result.filePath}`);
        result.messages.forEach((msg) => {
          if (msg.severity === 2) {
            this.core.logger.error(
              `Error: ${msg.message} in Line ${msg.line} Column ${msg.column}`
            );
          } else {
            this.core.logger.warn(
              `Warning: ${msg.message} in Line ${msg.line} Column ${msg.column}`
            );
          }
        });
      }
    });
    if (this.errorCount >= 1) {
      this._outputLabelLine('ESLint Failed');
      this.core.logger.error(
        `✖ ${this.errorCount + this.warningCount} problems(${this.errorCount} error, ${
          this.warningCount
        } warning)`
      );
      this._outputLabelLine('ESLint End');
      return false;
    } else if (this.warningCount >= 1) {
      this._outputLabelLine('ESLint Warned');
      this._outputLabelLine('ESLint End');
      return true;
    } else {
      this._outputLabelLine('ESLint Passed');
      this._outputLabelLine('ESLint End');
      return true;
    }
  }
  _outputLabelLine(s: string) {
    this.core.logger.log(`========${s}========`);
  }
}

export default EslintPlugin;
