The modal that I created for choosing a board size does not render in Firefox, 
so in order to get to generate the game board you will need to navigate to game.html 
in your web browser, then select one of the options from the Reset and Change Board 
Size drop down. In Game.html, clicking on the "Import Saved Game" button will trigger 
an XML request that retrieves the contents of the saved.json file. That data will then
overwrite the gameboard, and create an HTML 5 notification element that will show the 
contents of the data retrieved from the XML request. Although we were not asked to use 
a notification object, I didn't want to clutter either the game.html or index html any 
further, and I thought it would be fun to learn how notifications worked. 

 JS code to trigger the xml request: game.js, line 196