pipeline {
    // 'agent any' means this pipeline can run on any available Jenkins agent.
    agent any


    stages {
        // STAGE 1: Checkout Code
        // This stage clones your repository from GitLab into the Jenkins workspace.
        stage('Checkout') {
            steps {
                echo 'Checking out the code...'
                checkout scm        
            }
        }

        stage('Staging Deploy') {
            steps {
                script {
			        withCredentials([file(credentialsId: 'backend-env-file', variable: 'DOTENV_FILE')]) {
                        sh 'chown -R jenkins:jenkins .'
                        sh 'chmod -R u+w .'
                        
                        sh "cp ${DOTENV_FILE} .env"

                        // First, try to stop the compose services
                        sh 'docker compose -f compose.prod.yml down -v --remove-orphans || true'

                        // More comprehensive cleanup
                        sh '''
                            echo "=== Checking what's using port 80 ==="
                            sudo netstat -tlnp | grep :80 || echo "Nothing found on port 80"
                            sudo lsof -i :80 || echo "No processes found using port 80"
                            
                            echo "=== Stopping system nginx if running ==="
                            sudo systemctl stop nginx || true
                            sudo service nginx stop || true
                            
                            echo "=== Killing processes on ports 80 and 443 ==="
                            sudo fuser -k 80/tcp || true
                            sudo fuser -k 443/tcp || true
                            
                            echo "=== Stopping Docker containers using these ports ==="
                            docker ps --filter "publish=80" -q | xargs -r docker stop || true
                            docker ps --filter "publish=443" -q | xargs -r docker stop || true
                            
                            echo "=== Removing all stopped containers ==="
                            docker container prune -f || true
                            
                            echo "=== Waiting for ports to be released ==="
                            sleep 5
                            
                            echo "=== Final port check ==="
                            sudo netstat -tlnp | grep :80 || echo "Port 80 is now free"
                        '''

                        // 2. Explicitly remove any lingering containers by name (e.g., redis-moai)
                        def containers = sh(returnStdout: true, script: 'docker ps -a --format "{{.Names}}"').trim()
                        if (containers.contains('redis-moai')) {
                            echo "Found and removing old 'redis-moai' container."
                            sh 'docker rm -f redis-moai'
                        }
                        if (containers.contains('mysql-moai')) {
                            echo "Found and removing old 'mysql-moai' container."
                            sh 'docker rm -f mysql-moai'
                        }

                        sh 'docker compose -f compose.prod.yml up --build -d'
                    }
                }
            }
        }

        stage('Remove Old Container') {
            steps {
                script {
                    sh 'docker image prune'
                }
            }
        }
    }
}
