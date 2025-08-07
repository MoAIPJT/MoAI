pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE_BACKEND = "choiinyong/backend-app"
        DOCKER_IMAGE_FRONTEND = "choiinyong/frontend-app"
        BACKEND_CONTAINER_NAME = "backend"
        FRONTEND_CONTAINER_NAME = "frontend-app"
        EC2_SSH = credentials('ec2-ssh-key')
        EC2_HOST = "ec2-user@15.165.18.135"
        DOCKER_NETWORK = "shared-network"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'release',
                    credentialsId: 'gitlab-token',
                    url: 'https://lab.ssafy.com/s13-webmobile1-sub1/S13P11B201.git'
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    sh """
                        echo \$DOCKERHUB_CREDENTIALS_PSW | docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin

                        docker build -t $DOCKER_IMAGE_BACKEND:latest backend/
                        docker push $DOCKER_IMAGE_BACKEND:latest

                        docker build -t $DOCKER_IMAGE_FRONTEND:latest frontend/
                        docker push $DOCKER_IMAGE_FRONTEND:latest
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    script {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i \$SSH_KEY $EC2_HOST '
                              echo \$DOCKERHUB_CREDENTIALS_PSW | docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin &&
                              docker network create $DOCKER_NETWORK || true &&

                              docker pull $DOCKER_IMAGE_BACKEND:latest &&
                              docker stop $BACKEND_CONTAINER_NAME || true &&
                              docker rm $BACKEND_CONTAINER_NAME || true &&
                              docker run -d --name $BACKEND_CONTAINER_NAME --network $DOCKER_NETWORK -p 8080:8080 $DOCKER_IMAGE_BACKEND:latest &&

                              docker pull $DOCKER_IMAGE_FRONTEND:latest &&
                              docker stop $FRONTEND_CONTAINER_NAME || true &&
                              docker rm $FRONTEND_CONTAINER_NAME || true &&
                              docker run -d --name $FRONTEND_CONTAINER_NAME --network $DOCKER_NETWORK -p 80:80 $DOCKER_IMAGE_FRONTEND:latest
                            '
                        """
                    }
                }
            }
        }
    }
}
