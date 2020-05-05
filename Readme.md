## Build Momentum

### Motivation

- How difficult is it to getting up and running with a goal?
- How many times people start learning new things or building new habits end abruptly?

I believe in accountability and consistency during the process, especially in the beginning. It is the sheer consistency over a period that builds momentum that accelerates the process of achieving goals.

I chose to develop a minimal web app that demonstrates technical skills and simulates the above process to fit my needs.
Each user can activate only one goal and work on it for a week. Add the tasks that direct you towards the goal and stay
accountable through the progress of the week. Rinse and Repeat!

### Server-Side Technical Skills

- Server-side API is developed in Express.js (Node.js Web Application Framework) and Database in MongoDB.
- JSON Web Token is used to implement authentication and authorization of the app. App uses Access tokens to authorize the user and Refresh tokens to generate additional access tokens.
- Supports server-side pagination and caching of the resources. Redis is used to implement the cache layer.
- User uploaded assets are stored in the Cloudinary (Cloud-based image and video management platform).
- Each active goal is valid until Saturday midnight of that week. Custom Heroku scheduler script automates this process of archiving.
