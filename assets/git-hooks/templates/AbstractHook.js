const path = require('path');

class AbstractHook {
  constructor() {
    this.middlewareList = [];
    if (new.target !== AbstractHook) {
      // if (!new.target.prototype.hasOwnProperty('getHookName')) {
      //   throw new Error('please override or overload getHookName method');
      // }
    } else {
      throw new Error('please override or overload constructor');
    }
  }

  /**
   * @description 获取当前仓库的名称
   */
  getRepositoryName() {
    // 此时已经处于执行git脚本阶段，所以不用判断.git是否存在
    // 寻找到.git的上级目录
    const pathList = __dirname.split(path.sep);
    const gitRootIndex = pathList.indexOf('.git');
    return pathList[gitRootIndex - 1];
  }

  /**
   * @description 获取当前仓库的路径
   */
  getRepositoryPath() {
    return __dirname.split('.git')[0];
  }

  use(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be function, but get ' + typeof fn);
    }
    this.middlewareList.push(middleware);
    return this;
  }

  /**
   * @description 聚合执行所有逻辑
   */
  run() {
    const middlewareList = this.middlewareList;
    // 统一在此处打印错误log和退出脚本
    return dispatch(0).catch((err) => {
      console.log(err);
      process.exit(1);
    });
    function dispatch(index) {
      const middleware = middlewareList[index];
      if (!middleware) {
        return;
      }
      try {
        // 默认为当前的core
        const ctx = this.core || {};
        const result = middleware(ctx, dispatch.bind(null, index + 1));
        return Promise.resolve(result);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
}

module.exports = AbstractHook;
