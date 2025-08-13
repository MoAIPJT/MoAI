pipeline {
    agent any


    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code...'
                checkout scm        
            }
        }

        stage('Staging Deploy') {
            steps {
                script {
                    sh 'docker compose -f compose.prod.yml down -v'
                    sh 'docker compose -f compose.prod.yml up --build -d'
                }
            }
        }
   
    }
}
