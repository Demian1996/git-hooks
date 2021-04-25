const AbstractHook = require('../AbstractHook');
const { exec } = require('child_process');
const GhCore = require('../../git-hooks-new.js').default;
const { ESLint } = require('eslint');
const process = require('process');

class PreCommitHook extends AbstractHook {
  constructor() {
    super();
    this.core = new GhCore({});
  }
}

const hook = new PreCommitHook();
hook.use(async (core, next) => {
  core.fileList = await new Promise((resolve, reject) => {
    exec('git diff --cached --diff-filter=ACMR --name-only', async (err, stdout) => {
      if (err) {
        reject(err);
      }
      resolve(stdout.split('\n').filter((diffFile) => /(\.js|\.jsx|\.ts|\.tsx)(\n|$)/gi.test(diffFile)));
    });
  });
  await next();
});

hook.use(async (core, next) => {
  const eslintPlugin = core['eslint-plugin'];
  eslintPlugin.setFileList(core.fileList);
  await eslintPlugin.lintFiles(new ESLint());
  const isOk = eslintPlugin.getResult();

  if (!isOk) {
    process.exit(1);
  }

  await next();
});

hook.run();
