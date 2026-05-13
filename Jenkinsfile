pipeline {
    agent any

    tools {
        // tell Jenkins to use the NodeJS installation you named earlier
        nodejs 'Node 24.1.0'
    }

    environment {
        VERCEL_TOKEN = credentials('VERCEL_TOKEN')
        TELEGRAM_BOT_TOKEN = credentials('TELEGRAM_BOT_TOKEN')
        TELEGRAM_CHAT_ID = credentials('TELEGRAM_CHAT_ID')
        TELEGRAM_CHAT_ID_TEST = credentials('TELEGRAM_CHAT_ID_TEST')
        NEXT_PUBLIC_SUPABASE_URL = credentials('NEXT_PUBLIC_SUPABASE_URL')
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = credentials('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    }

    stages {
        // your stages will go here
        stage('Install') {
            steps {
                sh 'npm ci' // npm ci installs precisely the versions in package-lock.json, ensuring consistent installs
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to preview') {
            when {
                branch 'main' // only deploy preview for main branch, but jenkins triggers for every single update in the repo
            }

            steps {
                script {
                    def previewUrl = sh(
                        script: 'npx vercel --token $VERCEL_TOKEN --yes', // replace with your Vercel scope if needed
                        returnStdout: true
                    ).trim()
                    env.PREVIEW_URL = previewUrl
                }
                sh """ 
                    curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
                    -d chat_id=${TELEGRAM_CHAT_ID_TEST} \
                    -d text="Test deployment preview is ready: ${env.PREVIEW_URL}"
                """
            }
        }

        stage('Approval') {
            when {
                branch 'main'
            }
            steps {
                input(
                    message: "Preview is live at ${env.PREVIEW_URL} — approve to deploy to production?",
                    ok: 'Deploy'
                )
            }
        }

        stage('Deploy to production') {
            when {
                branch 'main'
            }
            steps {
                sh 'npx vercel --token $VERCEL_TOKEN --prod --yes'
            }
        }
    }

    post {
        success {
            sh """ 
                    curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
                    -d chat_id=${TELEGRAM_CHAT_ID_TEST} \
                    -d text="Deployment successful"
                """
        }

        failure {
            sh """ 
                    curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
                    -d chat_id=${TELEGRAM_CHAT_ID_TEST} \
                    -d text="Deployment failed at ${env.STAGE_NAME} on \$(date)"
                """
        }
    }
}