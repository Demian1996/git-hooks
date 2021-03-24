const AbstractHook = require('../AbstractHook');
const GhCore = require('../../git-hooks-new.js').default;

class PreCommitHook extends AbstractHook {
  constructor() {
    super();
    this.core = new GhCore({});
  }
}

const hook = new PreCommitHook();

hook.use(async (core, next) => {
  const riskCheck = core['risk-check-plugin'];
  const projectPath = hook.getRepositoryPath();
  const riskPackages = await riskCheck.startCheck(projectPath);
  if (riskPackages.length > 0) {
    core.logger.error('检测到有以下依赖风险项');
    core.logger.error(riskPackages);
  }
  await next();
});

hook.run();
