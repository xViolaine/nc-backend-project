[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Press+Start+2P&size=13&duration=4200&color=31F73C&vCenter=true&multiline=true&lines=GLHF+Gaming;A+RESTful+API+%F0%9F%98%B4+by+xViolaine)](https://git.io/typing-svg)
![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

### 📝 ABOUT THE PROJECT

This API is intended to serve data for a future front-end project, the culmination of which will be a fully functioning website!

Users will be able to post reviews on given topics, as well as joining discussions by commenting on them. A 'vote' feature allows users to quickly show whether they liked or disliked a review. Further functionalities are already planned, including creating topics, voting on comment, and much more!

![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

### ✔️ 1. CLONE THE REPO
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

Terminal Commands:
```
$ git clone https://github.com/xViolaine/nc-backend-project.git
$ cd nc-backend-project
$ code .
```

![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

### ✔️ 2. INSTALL DEPENDENCIES
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
```programming
$ npm install
```

![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

### ✔️ 3. DOTENV

In order for you to be able to run this project locally you will need to create 2 files in the main directory:
```programming
.env.development
.env.test
```

You can refer to the ``` .env-example ``` file to see how the files should look, however in each file you can copy and paste the relevant text below.


``` .env.development ``` should contain the following:
```
PGDATABASE=nc_games
```

and ``` .env.test ``` should contain the following:
```
PGDATABASE=nc_games_test
```

This will connect the databases. The ``` .gitignore ``` already has all ``` .env ``` files added to it for security reasons when pushing to GitHub.

![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

### ✔️ 4. SEED THE LOCAL DATABASE
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

Run both of the following commands:
```
$ npm run setup-dbs
$ npm run seed
```

![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

### ✔️ 5. RUN TESTS
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) 

Tests can be run with the following:
```
$ npm t
```
OR
```
$ npm test
```

![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

### ✔️ 6. USAGE
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white) ![Insomnia](https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE)

Start the server listening with:
```
$ npm start
```
You can use a regular browser to make requests, or install a free framework for testing RESTful applications such as [Insomnia](https://insomnia.rest/download)

![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

## Node.js and Postgres
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

This project was created using:
```
$ node -v | v17.8.0
$ psql -V | 12.9
```
The above commands will also enable you to check your own version in the terminal. It is recommended you update both packages to their most recent versions prior to working with this app.

![rainbow-divider](https://github.com/xViolaine/nc-backend-project/blob/main/rainbow.png?raw=true)

<div align=right>
  <h6> Project created with thanks to: <a href="https://northcoders.com/">Northcoders</a>
  <p>README.md created with thanks to: <br>ReadMe Typing SVG | <a href="https://git.io/typing-svg">DenverCoder1</a>  
    <br>Badges | <a href="https://shields.io/">Shields IO</a></h6></p> 
</div>
