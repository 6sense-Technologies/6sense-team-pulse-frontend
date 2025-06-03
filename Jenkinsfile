pipeline {
  agent { label 'docker-agent' }

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    NODE_ENV = 'test'
    GHCR_USER = '6sense-technologies'
    GHCR_REPO = '6sense-team-pulse-frontend'
    SHORT_SHA = "${env.GIT_COMMIT.take(7)}"
    IMAGE_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}-${env.SHORT_SHA}".toLowerCase()
    DEPLOY_URL = 'https://app.6sensehq.com'
  }

  stages {
    stage('📦 Checkout Source Code') {
      steps {
        script {
          def deployUrl = env.DEPLOY_URL
          def repo = getRepoFromGitUrl()
          env.DEPLOYMENT_ID = createAndUpdateGitHubDeployment(repo, env.GIT_COMMIT, env.BRANCH_NAME, (env.BRANCH_NAME == 'beta') ? 'staging' : 'production', deployUrl)
        }
        checkout scm
      }
    }

    stage('🔨 Build Docker Image') {
      steps {
        sh "docker build -t ghcr.io/${GHCR_USER}/${GHCR_REPO}:${IMAGE_TAG} ."
      }
    }

    stage('📤 Push to GHCR') {
      steps {
        script {
          def deployUrl = env.DEPLOY_URL
          def repo = getRepoFromGitUrl()
          env.DEPLOYMENT_ID = createAndUpdateGitHubDeployment(repo, env.GIT_COMMIT, env.BRANCH_NAME, (env.BRANCH_NAME == 'beta') ? 'staging' : 'production', deployUrl)
        }
        withCredentials([usernamePassword(credentialsId: 'github-pat-6sensehq', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_PAT')]) {
          sh '''
            echo $GITHUB_PAT | docker login ghcr.io -u $GITHUB_USER --password-stdin
            docker push ghcr.io/${GHCR_USER}/${GHCR_REPO}:${IMAGE_TAG}
            docker image prune -f
          '''
        }
      }
    }

    stage('🚀 Deploy to Server') {
      when {
        anyOf {
          branch 'main'
          branch 'master'
          branch 'beta'
        }
      }
      steps {
        script {
          def infisicalEnv = (env.BRANCH_NAME == 'beta') ? 'dev' : 'prod'
          def deployDir = (env.BRANCH_NAME == 'beta') ? "6sense-team-pulse-frontend-beta" : "6sense-team-pulse-frontend-prod"
          def deployEnv = infisicalEnv
          def deployUrl = env.DEPLOY_URL
          def repo = getRepoFromGitUrl()

          updateGitHubDeploymentStatus(repo, env.BUILD_URL, env.DEPLOYMENT_ID, 'in_progress', (env.BRANCH_NAME == 'beta') ? 'staging' : 'production', env.DEPLOY_URL)

          withInfisical(configuration: [
            infisicalCredentialId: '6835f2d1ccea8e1cb5ed81e2',
            infisicalEnvironmentSlug: infisicalEnv,
            infisicalProjectSlug: 'ops4-team-znzd',
            infisicalUrl: 'https://infisical.6sensehq.com'
          ],
          infisicalSecrets: [
            infisicalSecret(
              includeImports: true,
              path: '/6sense-team-pulse-frontend',
              secretValues: [
                [infisicalKey: 'AUTH_SECRET'],
                [infisicalKey: 'AUTH_GOOGLE_SECRET'],
                [infisicalKey: 'AUTH_GOOGLE_ID'],
                [infisicalKey: 'HOST_PORT'],
              ]
            )
          ]) {
            // env.DEPLOYMENT_ID = createAndUpdateGitHubDeployment(repo, env.GIT_COMMIT, env.BRANCH_NAME, deployEnv, deployUrl)
            

            withCredentials([usernamePassword(credentialsId: 'github-pat-6sensehq', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_PAT')]) {
              writeFile file: '.env', text: """\
AUTH_SECRET=${AUTH_SECRET}
AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
CONTAINER_NAME=${deployDir}
HOST_PORT=${HOST_PORT}
IMAGE_TAG=${IMAGE_TAG}
NODE_ENV=production
"""

              sshagent(credentials: ['ssh-6sensehq']) {
                sh """
                  ssh -o StrictHostKeyChecking=no jenkins-deploy@95.216.144.222 "mkdir -p ~/${deployDir}"
                  scp -o StrictHostKeyChecking=no docker-compose.yml jenkins-deploy@95.216.144.222:~/${deployDir}/
                  scp -o StrictHostKeyChecking=no .env jenkins-deploy@95.216.144.222:~/${deployDir}/

                  ssh -o StrictHostKeyChecking=no jenkins-deploy@95.216.144.222 '
                    cd ~/${deployDir} &&
                    echo "$GITHUB_PAT" | docker login ghcr.io -u $GITHUB_USER --password-stdin &&
                    docker compose pull &&
                    docker compose up -d --remove-orphans
                  '
                """
              }
            }
          }
        }
      }
    }
  }

  post {
    success {
      script {
        def repo = getRepoFromGitUrl()
        updateGitHubDeploymentStatus(repo, env.BUILD_URL, env.DEPLOYMENT_ID, 'success', (env.BRANCH_NAME == 'beta') ? 'staging' : 'production', env.DEPLOY_URL)
      }
    }
    failure {
      script {
        def repo = getRepoFromGitUrl()
        updateGitHubDeploymentStatus(repo, env.BUILD_URL, env.DEPLOYMENT_ID ?: '0', 'failure', (env.BRANCH_NAME == 'beta') ? 'staging' : 'production', env.DEPLOY_URL)
      }
    }
  }
}

// -------------------
// GitHub API Helpers
// -------------------
def getRepoFromGitUrl() {
  def url = env.GIT_URL
  if (!url || url.trim() == '') {
    url = sh(script: "git config --get remote.origin.url", returnStdout: true).trim()
  }
  if (url.startsWith("git@github.com:")) {
    return url.replace("git@github.com:", "").replace(".git", "")
  } else if (url.startsWith("https://github.com/")) {
    return url.replace("https://github.com/", "").replace(".git", "")
  } else {
    error("Unknown Git URL format: ${url}")
  }
}

def createAndUpdateGitHubDeployment(String repo, String ref, String branch, String deployEnv, String deployUrl) {
  withCredentials([usernamePassword(credentialsId: 'github-pat-6sensehq', usernameVariable: 'GH_USER', passwordVariable: 'GITHUB_PAT')]) {
    withEnv(["TOKEN=${GITHUB_PAT}"]) {
      def description = "Deployed from Jenkins pipeline for branch ${branch}"
      def deploymentId = sh(
        script: """
          curl -s -X POST \\
            -H 'Authorization: token $TOKEN' \\
            -H 'Accept: application/vnd.github+json' \\
            https://api.github.com/repos/${repo}/deployments \\
            -d '{
              "ref": "${ref}",
              "task": "deploy",
              "auto_merge": false,
              "required_contexts": [],
              "description": "${description}",
              "environment": "${deployEnv}",
              "environment_url": "${deployUrl}",
              "sha": "${ref}"
            }' | grep -o '"id":[0-9]*' | head -n1 | cut -d':' -f2
        """,
        returnStdout: true
      ).trim()
      echo "deploymentId"
      echo deploymentId
      return deploymentId
    }
    
  }
}

def updateGitHubDeploymentStatus(String repo, String logUrl, String deploymentId, String status, String deployEnv, String deployUrl) {
  withCredentials([usernamePassword(credentialsId: 'github-pat-6sensehq', usernameVariable: 'GH_USER', passwordVariable: 'GITHUB_PAT')]) {
    withEnv(["TOKEN=${GITHUB_PAT}"]) {
      sh """
        curl -s -X POST \\
          -H 'Authorization: token $TOKEN' \\
          -H "Accept: application/vnd.github+json" \\
          https://api.github.com/repos/${repo}/deployments/${deploymentId}/statuses \\
          -d '{
            "state": "${status}",
            "log_url": "${logUrl}",
            "description": "Deployment ${status}",
            "environment": "${deployEnv}",
            "environment_url": "${deployUrl}"
          }'
      """
    }
    
  }
}
