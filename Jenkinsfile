pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'bharani2121/mydocker_11'
        TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/bharani2121/DOCKER_JENKINS.git'
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
                        sh 'echo "Running dummy tests (add pytest if needed)"'
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'dockerhub-credentials', url: '']) {
                        docker.image("${DOCKER_IMAGE}:${TAG}").push()
                    }
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker stop mydocker_11 || true
                    docker rm mydocker_11 || true
                    docker run -d --name mydocker_11 -p 5000:5000 ${DOCKER_IMAGE}:${TAG}
                """
            }
        }
    }
}

