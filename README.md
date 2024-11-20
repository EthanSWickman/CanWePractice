# CanWePractice
A discord bot to tell Beavers whether or not they can sail given wind conditions at Eugene Yacht Club. 

# How to run the bot
type "npm run bot" into the shell

# Bot Functions
- everyone
    - /weathernow (responds with current weather conditions)
    - /weathertoday (responds with today's weather conditions)
    - /weathertomorrow (responds with tomorrow's weather conditions)
- admin only
    - /parrot {_channel_} {_text_} (sends a specified text message to a specified channel)

# Bot Functions (coming soon)
- everyone
    - /weatherpractice (responds with weather conditions at next practice)
    - /weatherpractices (responds with weather conditions at next practices)
- admin only
    - /configpractices {_practice\_days_} {_practice\_time\_1_} {_practice\_time\_2_} {_..._} (configure practice times - example "/configpractices MThSu 1630 1600 1000")
    - /configofficerpracticereminders {_channel_} {_advance\_hours_} (send officer practice reminders to _channel_ _advance\_hours_ before practice)
    - /configpracticereminders {_channel_} {_advance\_hours_} (send general practice reminders to _channel_ _advance\_hours_ before practice)
    - more commands to configure, for example, a different practice location for the server