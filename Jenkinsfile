@Library('jenkins-library' ) _

def pipeline = new org.js.AppPipeline(
    steps: this,
    buildDockerImage: 'build-tools/node:14-alpine',
    dockerImageName: 'klaytn/klaytn-frontend',
    dockerRegistryCred: 'bot-klaytn-rw',
    packageManager: 'pnpm',
    testCmds: ['pnpm format:check', 'pnpm lint', 'pnpm typecheck', 'pnpm test'],
    buildCmds: ['pnpm build'],
    sonarProjectName: 'klaytn-frontend',
    sonarProjectKey: 'jp.co.soramitsu:klaytn-frontend',
    gitUpdateSubmodule: true)
pipeline.runPipeline()