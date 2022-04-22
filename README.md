# CanWePractice
A discord bot to tell Beavers whether or not they can sail given wind conditions at Eugene Yacht Club. Uses Node.js and the discord.io package.

# How to run the bot
type "npm run bot" into the shell

# Bot Functions (not yet implemented)
<ul>
<li>!nextpractices (displays hourly wind and rain data and recommendation for practices that end within 48 hours, and 3 hour data for practices within 5 days, and daily data for practices within 7 days, always reaches 3 practices)</li>
<li>!weathernow (gives data on the current wind levels at EYC</li>
<li>day-before-practice-alert (sends a message 24 hours before the start of practice giving hourly data)</li>
<li>day-of-practice-alert (sends a message 4 hours before practice giving hourly data)</li>
</ul>

# Output Examples
<ul>
<li>4 hour practice (hourly):

-- DAYNAME, MONTH 00 ---------------------------------------------
-- ALERT!!! WEATHER ALERT DESCRIPTION ----------------------------
0000: 0 knots, 56F, 40% rain
0100: 2 knots, 64F, 20% rain
0200...
0300...
------------------------------------------------------------------
</li>
<li>8 hour practice (hourly): same as above with more lines</li>
<li>4 hour practice (tri-hourly): 

-- DAYNAME, MONTH 00 ---------------------------------------------
-- ALERT!!! WEATHER ALERT DESCRIPTION ----------------------------
0000: 0 knots, 56F, 40% rain
0300: 0 knots, 64F, 30% rain
0600...
------------------------------------------------------------------
</li>
<li>8 hour practice (tri-hourly): same as above but over 9 hours starting an hour before practice)</li>
<li>weather now:

-- DAYNAME, MONTH, 00 (CURRENT CONDITIONS) -----------------------
0035: 12 knots, 73F, 0% rain
------------------------------------------------------------------</li>