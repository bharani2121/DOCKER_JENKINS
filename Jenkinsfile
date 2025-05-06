pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'yourdockerhubusername/my-app'
        TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/yourusername/your-repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${TAG}")
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    docker.image("${DOCKER_IMAGE}:${TAG}").inside {
                        sh 'pytest test/test_app.py'
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-credentials', url: '']) {
                    docker.image("${DOCKER_IMAGE}:${TAG}").push()
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker stop my-app || true
                    docker rm my-app || true
                    docker run -d --name my-app -p 5000:5000 ${DOCKER_IMAGE}:${TAG}
                """
            }
        }
    }
}

