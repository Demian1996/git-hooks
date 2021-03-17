const GhCore = require('../../git-hooks-new.js');
const process = require('process');

class CommitMsgHook {
  constructor() {
    this.core = new GhCore({
      whiteList: [],
    });
  }

  run() {
    const commitMsgStoragePath = process.argv.slice(-1)[0];

    try {
      this.core['commit-message-plugin'].setCommitMsgStoragePath(commitMsgStoragePath);

      // 读取 commit
      const commitMsg = this.core['commit-message-plugin'].readCommitMessage();

      const commitMsgCheckresult = this.core['commit-message-check-plugin'].standardChecker(commitMsg);
      if (!commitMsgCheckresult.isPass) {
        console.error(`commitMessage-不符合规范-缺少：+ ${commitMsgCheckresult.missKeywords.join(',')}`);
        process.exit(1);
      }

      // 修改 commit
      this.core['commit-message-plugin'].writeCommitMessage(`[linted]${commitMsg}`);
    } catch (err) {
      console.error(err);
    }
  }
}

const hook = new CommitMsgHook();
hook.run();
