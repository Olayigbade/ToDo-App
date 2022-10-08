# Serverless TODO

This is a simple TODO application using AWS Lambda and Serverless framework. It is a backend application that allows users to create/read/update and delete todo items through a AWS APIGateway and is connected to AWS Lambda functions. Authorization is done using Auth0 and will required login using Google in order to interact with the API

# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# Frontend

See client README file

# Getting Started





# Deploy Backend 

            cd backend

            npm install

            npm install --save-dev serverless-iam-roles-per-function@next 

            serverless

            serverless deploy --verbose

# Deploy Frontend

            cd client
            
            npm install

            npm run start


The client folder contains a web application that can use the API that should be developed in the project.

To use it please edit the config.ts file in the client folder:


                const apiId = '...' API Gateway id
                export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

                export const authConfig = {
                domain: '...',    // Domain from Auth0
                clientId: '...',  // Client id from an Auth0 application
                callbackUrl: 'http://localhost:3000/callback'
                }

