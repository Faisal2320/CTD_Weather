requirements:
to locally run the website,
open command line and change directory to the folder containing the index.html file
run the below command:

- python -m http.server 8000

go to web browser
http://localhost:8000/index.html

or

open the index.html file with liveserver from VScode

<!-- General Information about the app functionality: -->

Homepage:
-- the home page gives you information about sunrise, sunset,precepitation percentage and minmum and maximum rempreture of the day by taking you location

Worldwide Weather:
-- this page have two select input: countries and states which are sorted alphabaticaly
-- buy selecting a country the states input loads the states of selected country and the first state is automatically selected and submitted for weather data
by selecting of changing state the coordinates are updated in the api search url and data is fetched
-- there is the button for showing your town weather with details

About page:
-- infomation about the website

<!-- ============================================== -->

STRUCTURE:

A public GitHub repository containing your project

An HTML document for the page

A CSS document to style the HTML page

A JavaScript file that retrieves data from one of several public API sources to display the data on your HTML page

A README file that includes the instructions for running the webpage

CONTENT:

Display the data for at least 2 of the models in the API (index.html and weather.html)

Include navigation from each model’s page to the other models that are displayed

Issue new GET requests for the linked data to display in the linked pages.

FUNCTIONALITY:

Code runs without issues by following the instructions in the README file

Navigation between the different models behaves properly and is not slowed down by requesting more data than needs to be displayed

Code is readable and well structured

error cases are appropriately handled

Styling is effective (example: font-sizes are not too small or large, colors are not too dark/light to be easily seen, etc.)
