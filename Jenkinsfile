pipeline {
  agent { label 'docker-agent' }

  environment {
    NODE_ENV = 'test'
    GHCR_USER = '6sense-technologies'
    GHCR_REPO = '6sense-team-pulse-frontend'
    SHORT_SHA = "${env.GIT_COMMIT.take(7)}"
    IMAGE_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}-${env.SHORT_SHA}".toLowerCase()
  }

  stages {

    stages {
    stage('🔪 Cancel Previous Builds (Same Branch)') {
      steps {
        script {
          def currentBuildNumber = currentBuild.number
          def currentBranch = env.BRANCH_NAME
          def job = Jenkins.instance.getItemByFullName(env.JOB_NAME)

          job.builds.each { build ->
            if (
              build.isBuilding() &&
              build.number != currentBuildNumber &&
              build.getEnvironment(TaskListener.NULL).BRANCH_NAME == currentBranch
            ) {
              println "Aborting previous build #${build.number} for branch ${currentBranch}"
              build.doKill()
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
