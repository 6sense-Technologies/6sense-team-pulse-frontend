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
  }

  stages {

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
          def infisicalEnv = (env.BRANCH_NAME == 'beta') ? 'dev' : 'production'
          def deployDir = (env.BRANCH_NAME == 'beta') ? "6sense-team-pulse-frontend-beta" : "6sense-team-pulse-frontend-prod"
    
          withInfisical(configuration: [
              infisicalCredentialId: '6835f2d1ccea8e1cb5ed81e2',
              infisicalEnvironmentSlug: infisicalEnv,
              infisicalProjectSlug: 'ops4-team-znzd',
              infisicalUrl: 'https://infisical.6sensehq.com'
            ],
            infisicalSecrets: [
              infisicalSecret(
                includeImports: true,
                path: '"/6sense-team-pulse-frontend"',
                secretValues: [
                  [infisicalKey: 'AUTH_SECRET'],
                  [infisicalKey: 'AUTH_GOOGLE_SECRET'],
                  [infisicalKey: 'AUTH_GOOGLE_ID'],
                  [infisicalKey: 'CONTAINER_NAME'],
                  [infisicalKey: 'HOST_PORT'],
                  [infisicalKey: 'IMAGE_TAG'],
                ]
              )
            ]) {
    
            sshagent(credentials: ['staging-ssh']) {
              sh """
                ssh -o StrictHostKeyChecking=no jenkins-deploy@95.216.144.222 << 'EOF'
                  cd ~/${deployDir}
    
                  echo "⚙️ Writing .env file..."
                  cat <<EOT > .env
    AUTH_SECRET=${AUTH_SECRET}
    AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
    AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
    CONTAINER_NAME=${CONTAINER_NAME}
    HOST_PORT=${HOST_PORT}
    IMAGE_TAG=${IMAGE_TAG}
    NODE_ENV=production
    EOT
    
                  echo "📦 Pulling and Restarting Docker containers..."
                  echo "docker compose pull"
                  echo "docker compose up -d --remove-orphans"
                EOF
              """
            }
          }
        }
      }
    }

    
    stage('📦 Checkout Source Code') {
      steps {
        checkout scm
      }
    }

    stage('📥 Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('🧪 Run Unit Tests') {
      when {
        anyOf {
          branch 'main'
          branch 'master'
          branch 'beta'
        }
      }
      steps {
        sh 'npm test'
      }
    }

    stage('🔨 Build Docker Image') {
      steps {
        script {
          sh "docker build -t ghcr.io/${GHCR_USER}/${GHCR_REPO}:${IMAGE_TAG} ."
        }
      }
    }

    stage('📤 Push to GHCR') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-pat-6sensehq', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_PAT')]) {
          sh '''
            echo $GITHUB_PAT | docker login ghcr.io -u $GITHUB_USER --password-stdin
            docker push ghcr.io/${GHCR_USER}/${GHCR_REPO}:${IMAGE_TAG}
            docker image prune -f
          '''
        }
      }
    }
  }

  post {
    failure {
      echo "❌ Pipeline failed on branch ${env.BRANCH_NAME}"
    }
    success {
      echo "✅ Pipeline succeeded on branch ${env.BRANCH_NAME}, image: ${IMAGE_TAG}"
    }
  }
}
