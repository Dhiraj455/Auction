# Auction Bidding System 

## Common Commands For Both Auction And Server
```
npm install
cp .env.example .env
```

# <b> User Management And Authentication Micro Service </b>
 Server Folder Contains User Management and Authentication Micro Service 

## How to run
```
npm start
```
### Docker Hub Server (User Management and Authentication)
https://hub.docker.com/repository/docker/dhirajshelke/task_auction

### Test Cases Are Provided In Test Folder Of Server
### How To Run Tests
```
npm run test
```

### To Access Admin It's Credentials Are
```
Admin Email = "admin@gmail.com"
Admin Password = "admin12345"
```

### If Testing in Postman or API Testing Extension Then Run Login And Store The Token Generated For Both User And Admin And Add Header Field 
<h3>This Is For Authentication</h3>

```
key = Cookie
value = token=Generated Token
```

<h4>Commands To Spin Docker Container</h4>

```
docker compose up
```
<h4>Run From Docker Hub</h4>

```
docker run --env-file .env -p 8000:8000 dhirajshelke/task_auction:latest
```
# <b> Auction Management And Bidding Micro Service </b>
 Auction Folder Contains Auction Management And Bidding Micro Service 

## How to run
```
npm start
```
### Docker Hub Server (Auction Management And Bidding)
https://hub.docker.com/repository/docker/dhirajshelke/task_auction_bid

### Test Cases Are Provided In Test Folder Of Server
### How To Run Tests
```
npm run test
```
### Test Cases Doesn't Consist End Auction Testing As For End Auction Testing End Date Must Be Passed And While Creating An Auction We Can,t Create An Auction With End Date Passed
### To Access Admin It's Credentials Are
```
Admin Email = "admin@gmail.com"
Admin Password = "admin12345"
```

### If Testing in Postman or API Testing Extension Then Use The Stored Token From Before
<h3>This Is For Authentication</h3>

```
key = Cookie
value = token=Generated Token
```

<h4>Commands To Spin Docker Container</h4>

```
docker compose up
```
<h4>Run From Docker Hub</h4>

```
docker run --env-file .env -p 8001:8001 dhirajshelke/task_auction_bid:latest
```

# <b>Expected Frontend</b>