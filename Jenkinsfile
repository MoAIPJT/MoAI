pipeline {
  agent any
  options { timestamps() }

  environment {
    EC2_HOST              = "ubuntu@15.165.18.135"
    REPO_URL              = "https://lab.ssafy.com/s13-webmobile1-sub1/S13P11B201.git"
    BRANCH                = "release"
    APP_DIR               = "/opt/app/S13P11B201"

    // Docker Hub
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    DOCKER_IMAGE_BACKEND  = "choiinyong/backend-app"
    DOCKER_IMAGE_FRONTEND = "choiinyong/frontend-app"

    BACKEND_CONTAINER_NAME  = "backend"
    FRONTEND_CONTAINER_NAME = "frontend-app"
    DOCKER_NETWORK          = "shared-network"

    GITLAB_CREDENTIALS    = credentials('gitlab-token')
  }

  stages {
    stage('Checkout (local)') {
      steps {
        git branch: "${BRANCH}",
            credentialsId: 'gitlab-token',
            url: "${REPO_URL}"
      }
    }

    stage('Build/Push/Deploy on EC2') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')]) {
          powershell("""
            \$ErrorActionPreference = 'Stop'
            \$SSH = "ssh -o StrictHostKeyChecking=no -i $env:SSH_KEY $env:EC2_HOST"

            & \$SSH "mkdir -p $env:APP_DIR"
            & \$SSH "if [ ! -d $env:APP_DIR/.git ]; then \
                        git clone --branch $env:BRANCH https://$env:GITLAB_CREDENTIALS_USR:$env:GITLAB_CREDENTIALS_PSW@${env:REPO_URL.Replace('https://','')} $env:APP_DIR; \
                      else \
                        cd $env:APP_DIR && git fetch --prune && git checkout $env:BRANCH && git pull; \
                      fi"

            & \$SSH "printf %s '$env:DOCKERHUB_CREDENTIALS_PSW' | docker login -u '$env:DOCKERHUB_CREDENTIALS_USR' --password-stdin"

            # 2) (옵션) EC2에서 사전 빌드 – Dockerfile이 멀티스테이지가 아니라면 주석 해제
            #    * 이걸 쓰려면 EC2에 Maven/Node가 설치되어 있어야 함.
            & \$SSH "cd $env:APP_DIR/backend  && mvn -B -DskipTests clean package"
            & \$SSH "cd $env:APP_DIR/frontend && npm ci && npm run build"

            # 3) Docker Build & Push (EC2에서)
            & \$SSH "cd $env:APP_DIR/backend  && docker build -t $env:DOCKER_IMAGE_BACKEND:latest  . && docker push $env:DOCKER_IMAGE_BACKEND:latest"
            & \$SSH "cd $env:APP_DIR/frontend && docker build -t $env:DOCKER_IMAGE_FRONTEND:latest . && docker push $env:DOCKER_IMAGE_FRONTEND:latest"

            # 4) Deploy (컨테이너 재기동)
            & \$SSH "docker network create $env:DOCKER_NETWORK || true"
            & \$SSH "docker rm -f $env:BACKEND_CONTAINER_NAME  || true && docker pull $env:DOCKER_IMAGE_BACKEND:latest  && docker run -d --name $env:BACKEND_CONTAINER_NAME  --network $env:DOCKER_NETWORK -p 8080:8080 $env:DOCKER_IMAGE_BACKEND:latest"
            & \$SSH "docker rm -f $env:FRONTEND_CONTAINER_NAME || true && docker pull $env:DOCKER_IMAGE_FRONTEND:latest && docker run -d --name $env:FRONTEND_CONTAINER_NAME --network $env:DOCKER_NETWORK -p 80:80   $env:DOCKER_IMAGE_FRONTEND:latest"
          """)
        }
      }
    }
  }

  post { always { cleanWs() } }
}
