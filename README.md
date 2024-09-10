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

### redirect to the next.js task folder with the below command
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


########## React Native Expo INSTALLATION ##########

### redirect to the react native expo task folder with the below command
cd react-native-chat-app

### Install the dependencies
npm install

# Create .env file and add the following info
PORT=3503
EXPO_PUBLIC_BASE_URL="http://134.145.1.56:5007" # Change 134.145.1.56 to your host machine IP Address
EXPO_PUBLIC_BASE_URL_API="http://134.145.1.56:5007/api" # Change 134.145.1.56 to your host machine IP Address
EXPO_PUBLIC_USER_ACTIVE_STATUS="active"
EXPO_PUBLIC_ENVIRONMENT= "dev"

# run the task
npx expo start

# Generate users (user the below post endpoint in postman or any of your prefer test API platform to generate 100 users)
## You can find the users list in "utils/users.js". Use email and password of an record to login
`http://localhost:5007/api/users/create-users/`

```

## NextJS UI Screenshots

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

## React Native Expo UI Screenshots

### Sign up

![WhatsApp Image 2024-09-11 at 00 16 27](https://github.com/user-attachments/assets/2e558075-ff8d-4d12-8b05-8d61fab984ea)

### Sign in

![WhatsApp Image 2024-09-11 at 00 16 10](https://github.com/user-attachments/assets/ee685bcd-cc58-488d-bfac-d0443dc02279)

### User contact list

![WhatsApp Image 2024-09-10 at 23 58 48](https://github.com/user-attachments/assets/4f621f68-3015-490c-ae0c-0cff54d3fb93)

### Chat area

![WhatsApp Image 2024-09-11 at 00 08 34](https://github.com/user-attachments/assets/aada03fe-2ef4-41c2-8d2b-6ce630d68e4e)

### Coontact info 1

![WhatsApp Image 2024-09-11 at 00 09 34](https://github.com/user-attachments/assets/4474ce89-71ae-4ad3-85eb-7b51c9f91b78)

### Coontact info 2

![WhatsApp Image 2024-09-11 at 00 09 51](https://github.com/user-attachments/assets/b06db8cb-a0ea-4552-a7ac-9bb83068f927)

### Story feed

![WhatsApp Image 2024-09-11 at 00 12 17](https://github.com/user-attachments/assets/83221d3c-ee10-4888-8227-4d75ca533ea8)

### Settings

![WhatsApp Image 2024-09-11 at 00 12 49](https://github.com/user-attachments/assets/0d18d3ba-bbaf-4172-929b-0a590c81f5d8)

### Add new group

![WhatsApp Image 2024-09-11 at 00 14 02](https://github.com/user-attachments/assets/79e3093f-0f42-432d-b671-6c3310268698)

### Group info

![WhatsApp Image 2024-09-11 at 00 32 57](https://github.com/user-attachments/assets/68a33b48-ccad-48ce-b50a-23b23df9f27d)

### Prefer language

![WhatsApp Image 2024-09-11 at 00 15 28](https://github.com/user-attachments/assets/7f860817-0690-47b7-9153-74bc46156f2f)
