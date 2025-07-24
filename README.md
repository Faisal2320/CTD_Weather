requirements:
to locally run the website,
open command line and change directory to the folder containing the index.html file
run the below command:
python -m http.server 8000

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
