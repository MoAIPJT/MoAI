pipeline {
    // 'agent any' means this pipeline can run on any available Jenkins agent.
    agent any

    stages {
        // STAGE 1: Checkout Code
        // This stage clones your repository from GitLab into the Jenkins workspace.
        stage('Checkout') {
            steps {
                echo 'Checking out the code...'
                // 'scm' is a special variable that refers to the Source Code Management
                // configuration you set up in the Jenkins job (your GitLab repo).
                checkout scm
                echo 'SUCESS: Checkout'
            }
        }

        // STAGE 2: Build and Deploy Backend Services
        // This stage finds your backend's compose file and runs it.
        stage('Deploy Backend') {
            steps {
                script {
                    echo "Deploying backend services..."
                    // This command uses the Docker Pipeline plugin.
                    // It looks for 'backend/compose.yaml', builds the images
                    // if they are new (--build), and starts the services in the
                    // background (--detached).
                    dockerCompose(file: 'backend/compose.yaml', up: true, build: true, detached: true)
                    echo 'SUCESS: Backend Deployment'
                 
                }
            }
        }

        // STAGE 3: Build and Deploy Frontend Services
        // This stage does the same for your frontend.
        stage('Deploy Frontend') {
            steps {
                script {
                    echo "Deploying frontend services..."
                    dockerCompose(file: 'frontend/compose.yml', up: true, build: true, detached: true)
                    echo 'SUCESS: Frontend Deployment'
                }
            }
        }

        // STAGE 4: Cleanup
        // This is a good practice stage to remove old, unused Docker images
        // to save disk space on your server.
        stage('Cleanup Docker') {
            steps {
                echo 'Cleaning up old Docker images...'
                // The 'sh' step executes a shell command on the Jenkins agent.
                sh 'docker image prune -f'
                echo 'SUCESS: Docker CleanUp'
            }
        }
	}
}
