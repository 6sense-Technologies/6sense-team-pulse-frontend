pipeline {
  agent { label 'docker-agent' }

  environment {
    NODE_ENV = 'test'
    GHCR_USER = '6sense-Technologies'
    GHCR_REPO = '6sense-team-pulse-frontend'
    IMAGE_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run Unit Tests') {
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

    stage('Push to GHCR') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'ahsanaasim', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_PAT')]) {
          sh '''
            echo $GITHUB_PAT | docker login ghcr.io -u $GITHUB_USER --password-stdin
            docker push ghcr.io/${GHCR_USER}/${GHCR_REPO}:${IMAGE_TAG}
          '''
        }
      }
    }
  }

  post {
    failure {
      echo "❌ Tests failed on branch ${env.BRANCH_NAME}"
    }
    success {
      echo "✅ Tests passed on branch ${env.BRANCH_NAME}"
    }
  }
}
