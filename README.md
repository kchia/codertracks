# CoderTracks

CoderTracks is a web application that provides users with insightful analysis and useful data visualization of GitHub activity around the world by programming language or by country. Project/company owners will find CoderTracks useful. Project owners will be able to more efficiently find clusters of capable programmers in lower cost regions to hire for their projects. By analyzing the repositories and commits on GitHub, CoderTracks determines which programming languages are most popular and active in each part of the world, thereby pointing users in the right direction as to where to start their global search for programmers that fit their budget.  

CoderTracks is still under development. If you would like to make a contribution, please see the contribution guide for the git workflow.  
<https://github.com/CulturedCheese/thesis-project/CONTRIBUTING.md> 

Visit the app at:  
www.codertracks.com

## Team

- __Product Owner__: Todd Skinner
- __Scrum Master__: Hou Chia
- __Data Scientist__: Preston Parry

## Table of Contents

1. [Usage](#Usage)
1. [Technology Stack](#Technology Stack)
1. [Development](#development)
1. [Installing Dependencies](#installing-dependencies)
1. [Contributing](#contributing)


## Usage
- The user is presented with a map of the world, colored by the dominant programming language in each country. 
- The user can conduct a search either by programming language or by country. 
Searching by programming language presents the user with the top 10 countries by number of active developers in that language.
- Searching by country, or clicking on a country, presents the user with the most popular programing languages in that country. 
- The user can also retrieve a list of freelance developer profiles from oDesk (filtered by country, programming language, category, hourly rate, and oDesk’s feedback score). 
- The user can click on a freelancer’s profile and be taken directly to that person’s oDesk profile page.

## Technology Stack
Our team used the following technologies to create CoderTracks:
> 1. HTML/CSS/Javascript
2. React/Flux
3. Python
4. Node.js/Express
5. D3.js
6. Gulp.js
7. Travis CI
8. Bootstrap
9. Heroku
10. MySQL
11. Google BigQuery
12. OAuth/oDesk API
13. Mocha/Chai

## Development

## Documents

For the most up-to-date documentation on product functionality and technical architecture goto:  
<https://github.com/CulturedCheese/thesis-project/master/docs>

## Installation instructions

To get up and running on your local development machine:  
1. Fork the repo  
2. Run npm install  
3. Run gulp build
4. Run nodemon server/server.js  
6. Go to <http://localhost:5000>  

Additionally, to continually compile files and refresh the browser, run `gulp clean` and then run `gulp build` 

## Contributing Guidelines

CoderTracks is still under development. If you would like to make a contribution, please see the contribution guide for the git workflow.  
<https://github.com/CulturedCheese/thesis-project/CONTRIBUTING.md>

For any bugs or issues, please create a new issue at:  
<https://github.com/CulturedCheese/thesis-project/issues>
