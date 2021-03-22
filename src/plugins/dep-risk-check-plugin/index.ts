/*
 * @Author: hanks
 * @Date: 2021-03-12 11:01:39
 * @Last Modified by: hanks
 * @Last Modified time: 2021-03-22 16:58:48
 * @Description: 依赖风险检查
 *
 */
const lincenseChecker = require('license-checker');
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import os from 'os';
import GhCore from '../../core';

class DepRiskCheckPlugin {
  /**
  @description 项目以及子项目路径集合
   */
  monorepoPaths: string[] = [];
  constructor(core: GhCore) {

  }

  async startCheck(projectPath: string) {
    this._findMonoRepoPath(path.resolve(projectPath), 4);
    const repoToCheck = this._checkCachedResult();
    const riskPackages = await this._checkDependencyRisk(repoToCheck);
    return riskPackages;
  }
  /**
    @description 找出目录下所有项目及子项目路径
     */
  _findMonoRepoPath(dir: string, index: number) {
    this.monorepoPaths = [];
    const filelist = fs.readdirSync(dir)
    if (filelist.indexOf('package.json') !== -1) {
      this.monorepoPaths.push(dir);
      console.log(dir);
    }
    if (index === 0) {
      return;
    }
    filelist.forEach((file: string) => {
      const filePath = path.join(dir, file);
      if (!/node_modules/.test(file)) {
        const stat = fs.statSync(filePath);
        stat.isDirectory() && this._findMonoRepoPath(filePath, index - 1);
      }
    })
  }

  /**
  @description 对比检测缓存以加快二次检查
   */
  _checkCachedResult() {
    const depHashFile = path.resolve(os.homedir(), '.depHash.json');
    const depHashMap: Map<string, string> = new Map();
    this.monorepoPaths.forEach((repoPath: string) => {
      const packageFile = fs.readFileSync(path.join(repoPath, 'package.json'), { encoding: 'utf-8' });
      const packageJson = JSON.parse(packageFile);
      const depHash: string = md5(JSON.stringify({ ...packageJson.devDependencies, ...packageJson.dependencies }));
      depHashMap.set(repoPath, depHash);
    })

    const repoToCheck = []
    if (fs.existsSync(depHashFile)) {
      const cacheHashJson = JSON.parse(fs.readFileSync(depHashFile, { encoding: 'utf-8' }));
      for (const key in depHashMap) {
        if (cacheHashJson[key] !== depHashMap.get(key)) {
          repoToCheck.push(key);
        }
      }
    }
    fs.writeFile(depHashFile, JSON.stringify(depHashMap), { encoding: 'utf-8' }, () => { });
    return repoToCheck;
  }

  /**
 @description 检查各路径下依赖风险
  */
  async _checkDependencyRisk(repoToCheck: string[]) {
    const depChecks = repoToCheck.map((path) => {
      return new Promise((res) => {
        lincenseChecker.init({
          start: path,
          direct: true,
          exclude: 'MIT,BSD, WTFPL, Apache, Undefined, ISC, Public Domain, Unlicense, CC-BY-3.0, CC0-1.0, CC-BY-4.0,UNKNOWN,Apache-2.0',
        }, function (e: any, packages: any) {
          const riskPackages = [];
          for (const key in packages) {
            if (!/Custom:.*|UNKNOWN|MIT AND Zlib/.test(packages[key].licenses)) {
              riskPackages.push(packages[key]);
            }
          }
          res(riskPackages);
        })
      })

    })

    const riskPackages = await Promise.all(depChecks);
    let flatArray: any = [];
    flatArray = flatArray.concat(...riskPackages);
  }

}


export default DepRiskCheckPlugin;