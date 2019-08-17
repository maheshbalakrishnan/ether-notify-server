pipeline {
    agent {
        docker { image 'node:7-alpine' }
    }
    stages {
        stage('Test') {
            steps {
                sh 'node --version'
            }
        }
        stage('Build Image') {
            steps {
                sh 'echo "Under development"'       
            }
        }
    }
}