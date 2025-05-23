pipeline {
  agent {
    label 'docker-agent'
    docker {
      image 'node:18-alpine'
      args '-u root:root'
    }
  }

  environment {
    NODE_ENV = 'test'
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
