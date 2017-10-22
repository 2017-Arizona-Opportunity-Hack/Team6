![alt text](https://github.com/2017-Arizona-Opportunity-Hack/Team6/blob/master/assets/FootHills-app-logo.png "Foothills-logo")

## Setup
### Prerequisites
- node.js
### Installation
after cloning,

`cd OHacksBackend`

install dependencies

`npm install`

start up node server

`node index.js`

## The Problem
Currently, 1.5 million dogs and cats are euthanized each and every year. Foothills Animal Rescue of Scottsdale, Arizona strives to save as many animals each year by placing them in foster care and providing them with new homes. Animal control and shelters impose deadlines for their animals, stating that if a certain animal is not removed from their custody by within a certain time frame that animal will be euthanized. 

## Our Solution
We decided to go for a native app solution for a few important reasons
1. **Speed** — Due to the presence of deadlines, it is important that the app is able to quickly adjust. With a native app we are able to let the app run in the background and refresh data. This way, if any new potential animals become available, they will be quickly reflected in the app. A few hours to afew minutes could mean the difference between life and death for the animals 
2. **Notifications** - Using a native app allows us to make use of push notifications, which in turn allows us to notify potential fosters of new animals. Text message alerts are primitive, unsightly, and not dynamic. Additionally, using a native application would decrease the impact on the user's data plan.
3. **Ease of Use** - In this situation, the lives of hundreds of animals are at stake, therefore ease of use is a critical component. Having text messages constantly bombard your phone with links to webpages is a clunky experience and can be discouraging for potential fosters. The application we have created makes use of a simplistic interface that is intuitive and suitable for all ages. 

## Our Implementation
Throughout every step of the way we focused on reliability, scalability, and deployability to create a strong foundation that can easily be built upon and expanded in the future

### Backend 
For the backend we used Express.js, Node.js and MongoDB
The Backend handles the authentication of users and processes all the application requests through a server made in Node.

### Frontend
For the frontend we split it into two parts. The fosters or "users" interact with an Android application, The administrators use a web-based backend that was made using HTML, CSS and JavaScript.

The Android application front end follows Google's Material design specifications and maintains a simple aesthetic that is quick and easy to navigate throuh regardless of age.
#### Authentication 
![alt text](https://github.com/2017-Arizona-Opportunity-Hack/Team6/blob/master/assets/Login.jpeg "Login")
#### Home Screen
![alt text](https://github.com/2017-Arizona-Opportunity-Hack/Team6/blob/master/assets/Home.jpeg "home")
#### Animal Profile
![alt text](https://github.com/2017-Arizona-Opportunity-Hack/Team6/blob/master/assets/profile.jpeg "profile")
#### Foster Application
![alt text](https://github.com/2017-Arizona-Opportunity-Hack/Team6/blob/master/assets/Foster%20form.jpeg "application")
#### Push Notifications
![alt text](https://github.com/2017-Arizona-Opportunity-Hack/Team6/blob/master/assets/Push%20notification.jpeg "push")

## Current Status

## Going Forward



mongodb://<dbuser>:<dbpassword>@ds227865.mlab.com:27865/foothillsanimalrescue

url: ds227865.mlab.com
user: admin
pass: password
port: 27865
dataase: foothillsanimalrescue

foothills.herokuapp.com
