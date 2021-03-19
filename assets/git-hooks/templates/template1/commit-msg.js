const AbstractHook = require('../AbstractHook');
const GhCore = require('../../git-hooks-new.js');
const process = require('process');

class CommitMsgHook extends AbstractHook {
  constructor() {
    super();
    this.core = new GhCore({});
  }
}

const hook = new CommitMsgHook();
hook.use(async (core, next) => {
  const commitMsgStoragePath = process.argv.slice(-1)[0];
  core['commit-message-plugin'].setCommitMsgStoragePath(commitMsgStoragePath);

  // 读取 commit
  const commitMsg = core['commit-message-plugin'].readCommitMessage();

  // 注入对应字段
  core.commitMsg = commitMsg;
  await next();

  // 修改commit
  core['commit-message-plugin'].writeCommitMessage(`[linted]${commitMsg}`);
});

hook.use(async (core, next) => {
  const commitMsgCheckResult = core['commit-message-check-plugin'].standardChecker(core.commitMsg);
  if (!commitMsgCheckResult.isPass) {
    throw new Error(
      `commitMessage-不符合规范-缺少：+ ${commitMsgCheckResult.missKeywords.join(',')}`
    );
  }
});

hook.run();
