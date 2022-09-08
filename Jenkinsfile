@Library('jenkins-library' ) _

def pipeline = new org.js.AppPipeline(
    steps: this,
    buildDockerImage: 'build-tools/node:16-pnpm7',
    dockerImageName: 'klaytn/klaytn-frontend',
    dockerRegistryCred: 'bot-klaytn-rw',
    npmRegistries: [:],
    packageManager: 'pnpm',
    testCmds: ['pnpm format:check','pnpm lint','pnpm typecheck','pnpm test'],
    buildCmds: ['pnpm build'],
    sonarProjectName: 'klaytn-frontend',
    sonarProjectKey: 'jp.co.soramitsu:klaytn-frontend',
    dockerImageTags: ['master': 'latest', 'develop': 'dev', 'remove-ci-cratches': 'duty'],
    gitUpdateSubmodule: true)
pipeline.runPipeline()