```bash
### Clone the repo

git clone https://github.com/Cyrille09/chat-app.git

########## MONGODB DATABASE INSTALLATION ##########

create mongodb database and name it 'chat'

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

# run the task
npn run run:dev

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

# run the task
npm run dev

# Generate users (user the below post endpoint in postman or any of your prefer test API platform to generate 100 users)
## You can find the users list in "utils/users.js". Use email and password of an record to login
`http://localhost:5007/api/users/create-users/`

```

## UI Screenshots

### Main page

![Screenshot 2024-07-30 at 13 39 43](https://github.com/user-attachments/assets/ed3d60a9-5fa0-4a4e-8875-8a720f8a1f02)

### Add contact user

![Screenshot 2024-07-30 at 13 40 14](https://github.com/user-attachments/assets/d64ceeec-7f0e-4267-a0e2-11d9aebf8934)

### Receiver contact info and options to view starred messages, block contact user, etc...

![Screenshot 2024-07-30 at 13 42 00](https://github.com/user-attachments/assets/bdf94b32-83a4-417f-9144-89fad82ccf88)

### Create group page - The group members will be selected from your contact users list

![Screenshot 2024-07-30 at 13 43 26](https://github.com/user-attachments/assets/a71eab44-7a28-4500-843a-1ff13fc202c7)

### Edit user profile

![Screenshot 2024-07-30 at 13 43 49](https://github.com/user-attachments/assets/0f5faa24-4b55-485c-a633-0be128f30fb0)

### Prefer language - (Every text messages will be translated to your prefered language)

![Screenshot 2024-07-30 at 13 44 31](https://github.com/user-attachments/assets/d6bd15b7-dde6-43bc-a2f8-d6de40c2993f)

### Chat section

![Screenshot 2024-07-30 at 13 50 38](https://github.com/user-attachments/assets/bea94c9d-6738-4baf-a2cc-697bb0be632e)

### starred messages section

![Screenshot 2024-07-30 at 13 52 57](https://github.com/user-attachments/assets/a19ad8ba-7ff5-4f95-b1e8-1fe10b817ac8)

### Stroy feed section - (display every active story feed of your contact users including yours)

![Screenshot 2024-07-30 at 13 55 53](https://github.com/user-attachments/assets/6d3df72c-56e3-4501-8fbc-c8d940cf9059)

### View each story feed posted

![Screenshot 2024-07-30 at 13 56 21](https://github.com/user-attachments/assets/aa727910-f3ef-4bcd-a9ed-089feb261382)
