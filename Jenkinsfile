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

                        sh 'docker compose -f compose.prod.yml down -v'
                        sh 'docker compose -f compose.prod.yml up --build -d'
                    }
                }
            }
        }
    }
}
