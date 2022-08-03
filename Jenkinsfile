@Library('jenkins-library' ) _

def pipeline = new org.js.LibPipeline(steps: this,
    buildDockerImage: 'build-tools/node:16-pnpm7-test',
    dockerImageName: 'klaytn/klaytn-frontend',
    dockerRegistryCred: 'bot-klaytn-rw',
    npmRegistries: [:],
    packageManager: 'pnpm',
    testCmds: ['pnpm format:check','pnpm test'],
    buildCmds: ['pnpm build'],
    sonarProjectName: 'klaytn-frontend',
    sonarProjectKey: 'jp.co.soramitsu:klaytn-frontend',
    gitUpdateSubmodule: true)
pipeline.runPipeline()