/*
 * @Author: panxiao
 * @Date: 2021-03-12 11:01:39
 * @Last Modified by: wangdengzhi
 * @Last Modified time: 2021-03-19 14:44:05
 * @Description: commitMsg规范检查插件
 */
import GhCore from '../../core';
import { PluginRecord } from '../../constants';

class CommitMessageCheckPlugin {
  name = PluginRecord.CommitMessageCheckPlugin;
  standard: { [key: string]: any } = {
    merge: {
      required: [],
      options: [],
    },
    feature: {
      required: [],
      options: [],
    },
    bugfix: {
      required: ['why', 'how'],
      options: [],
    },
    optimize: {
      required: [],
      options: [],
    },
    config: {
      required: [],
      options: [],
    },
    revert: {
      required: [],
      options: [],
    },
  };
  /**
   * @description 插件核心
   */
  core: GhCore;

  constructor(core: GhCore) {
    this.core = core;
  }

  standardChecker(commitMessage: string) {
    let isSubKeyAllHave = true;
    let missKeywords = [];
    let i: string;
    for (i in this.standard) {
      const keyReg = new RegExp(i, 'ig');
      const bol = keyReg.test(commitMessage);
      if (bol) {
        const required = this.standard[i].required;
        for (let j = 0; j < required.length; j++) {
          const requiredKeyWord = required[j];
          const subKeyReg = new RegExp(requiredKeyWord, 'ig');
          if (subKeyReg.test(commitMessage)) {
            continue;
          } else {
            isSubKeyAllHave = false;
            missKeywords.push(requiredKeyWord);
            break;
          }
        }
        if (!isSubKeyAllHave) {
          return {
            isPass: false,
            missKeywords: missKeywords,
          };
        }

        const options = this.standard[i].options;

        if (options.length > 0) {
          for (let k = 0; k < options.length; k++) {
            const optionsKeyWord = options[k];
            const subKeyReg = new RegExp(optionsKeyWord, 'ig');
            if (subKeyReg.test(commitMessage)) {
              return {
                isPass: true,
                missKeywords: missKeywords,
              };
            }
          }
          missKeywords = missKeywords.concat(this.standard[i].options);
          return {
            isPass: false,
            missKeywords: missKeywords,
          };
        } else {
          return {
            isPass: isSubKeyAllHave,
            missKeywords: missKeywords,
          };
        }
      }
    }

    //收集一级miss key word
    for (let i in this.standard) {
      missKeywords.push(i);
    }

    return {
      isPass: false,
      missKeywords: missKeywords,
    };
  }
}

export default CommitMessageCheckPlugin;
