```bash
### Clone the repo

git clone https://github.com/Cyrille09/chat-app.git

########### NODE.JS INSTALLATION ###########

### redirect to the node.js task folder with the below command

cd nodejs-chat-app

### Install the dependencies

npm install

# Create .env file and add the following info

PORT=5007
WEB_SOCKET_PORT=4007
host=http://localhost
MONGO_URL="mongodb://localhost:27017/chat"
# Jwt
JWT_ACCESS_SECRET=FECCUH87UUHJJ9046TFG
JWT_REFRESH_SECRET=23347F1D48OJKIUUDJ7CBF4A4FB7
JWT_ACCESS_EXPIRY_TIME=1h
JWT_REFRESH_EXPIRY_TIME=30d

# MongoDB datatbase

create mongodb data and name it 'chat'

########## NEXT.JS INSTALLATION ##########

### redirect to the react.js task folder with the below command

cd next-chat-app

### Install the dependencies

npm install

# Create .env file and add the following info

PORT=3503
NEXT_PUBLIC_BASE_URL="http://localhost:5007"
NEXT_PUBLIC_BASE_URL_API="http://localhost:5007/api"
NEXT_PUBLIC_USER_ACTIVE_STATUS="active"
NEXT_PUBLIC_ENVIRONMENT= "dev"
NEXT_PUBLIC_SOCKET_BASE_URL="http://localhost:4007"



```

## UI Screenshots

### Main

Coming soon
