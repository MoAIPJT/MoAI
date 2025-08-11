pipeline {
    agent any

    stages {
        stage('Build and Bring Up DB') {
            steps {
                script {
                    def dbComposeFile = 'db/compose.yml'
                    if (fileExists(dbComposeFile)) {
                        echo "Bringing up database containers..."
                        sh "docker compose -f ${dbComposeFile} up -d"
                        echo "Database containers are up."
                        // Optional: Add a short delay to ensure DB is fully initialized
                        // sh "sleep 10"
                    } else {
                        error "DB Docker Compose file not found at ${dbComposeFile}"
                    }
                }
            }
        }

        stage('Build and Bring Up Backend') {
            steps {
                script {
                    def backendComposeFile = 'backend/compose.yaml'
                    if (fileExists(backendComposeFile)) {
                        echo "Bringing up backend containers..."
                        sh "docker compose -f ${backendComposeFile} up -d"
                        echo "Backend containers are up."
                        // Optional: Add a short delay
                        // sh "sleep 5"
                    } else {
                        error "Backend Docker Compose file not found at ${backendComposeFile}"
                    }
                }
            }
        }

        stage('Build and Bring Up Frontend') {
            steps {
                script {
                    def frontendComposeFile = 'frontend/compose.yml'
                    if (fileExists(frontendComposeFile)) {
                        echo "Bringing up frontend containers..."
                        sh "docker compose -f ${frontendComposeFile} up -d"
                        echo "Frontend containers are up."
                    } else {
                        error "Frontend Docker Compose file not found at ${frontendComposeFile}"
                    }
                }
            }
        }
    }

    post {
        always {
            // Optional: Clean up containers after the pipeline finishes
            // sh "docker compose -f db/compose.yml -f backend/compose.yaml -f frontend/compose.yml down"
            // echo "All containers have been taken down."
        }
        success {
            echo "Pipeline finished successfully."
        }
        failure {
            echo "Pipeline failed."
        }
    }
}