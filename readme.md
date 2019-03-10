<!-- Project M2
User Stories
As a User I want to signup so I can use the app
As a User I want to Login so I can use the app
As a User I want go to home page I can see the all routes.
As a User I want to Logout so I can go out the app
As a User I want to create items so I can can have more items in my offer list
As a User I want to update items so I can update my item in the list offer
As a User I want to delete items so I can delete my item in the list offer
As a User I want to have a offer list of VG so I can have match 
As a User I want to have a wish list so I can can have match
As a User I want update my profile to change the password or username or location -->
Trype
2.Readme
# Trype
## Description
An App to swap Books. You have a offer list and wish a list, and the App match your items with other’s user items.
 
## User Stories
- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can find books that I’m looking for
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **profile** - As a user I want to be able to edit my profile.
- **edit-profile** - As a user I want to be able to see my profile so I can change my information.
- **Items list** - As a user I want to see all the items available so that I can choose which ones I want to add to my list of ‘wants’ or ‘haves’.
- **Add to wants** - As a user I want to add an item that I’m looking for to my list of wants so I can swap it
- **Remove from wants** - As a user I want to delete items from the 'wants' list
- **Add to haves** - As a user I want to add an item that I have to my list so I can swap
- **Remove from haves** - As a user I want to delete items from the 'haves' list
- **Items detail** - As a user I want to see the Item details(Title, image, authors) and I can decide if I want to keep it in my lists
- **Matches** - As a user I want to see a list of possible swaps so I can decide if I want to go ahead and swap the items
- **Accept Swap** - As a user I can accept swap between 2 items
- **Reject Swap** - As a user I can reject swap between 2 items
## Backlog
List of other features outside of the MVPs scope
User profile:
- upload my profile picture
see other users profile
Threesome match
Geo Location:
- add geolocation to users profile
- show other users in your area in a map.
Homepage
- ...
## ROUTES:
- GET / 
  - renders the homepage with login or signup
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email
    - password
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password
- POST /auth/logout
  - Require User
  - body: (empty)
- GET /
  - Require User
  - renders /profile/list’s/matches section
- GET /profiles/:id
  - Require User
  - renders /profile
  
- GET /profiles/:id/edit
  - Require User
  - render /profile-edit
- POST /profiles/:id/edit
  - Require User
  - redirect /profile-edit
  body: 
    - id
    - username
    - password
    - email
- GET /books/
  - Require User
  - renders the list items page
  - includes the list books
- GET /books/edit
  - Require User
  - renders the list items page
  - includes the list books
- POST /books/edit 
  - Require User
  - renders /list/edit
  - body: 
    - id
    - status
  - check if matches are available
- GET /matches
  - Require User
  - render matches
 
- POST /matches/:id/:status
  - Require User
  - Redirect to /mathes
  - body: 
    - id
    - status
  
## Models
User model
 
```
username: String
password: String
email: String
books: [{
  item: ObjectID Books,
  status: enum wants/haves
}]
Location: String
Image: String
```
Books model
```
ISBN: String
Title: String
Author: Array
Image: String
status: Boolean //modificado
``` 
Match
```
_id: String
status: enum accept/reject
user1: {
  userID: ObjectID User, 
  ItemID: ObjectID Books,
  status: enum accept/reject
}
user2: {
  userID: ObjectID User, 
  ItemID: ObjectID Books,
  status: enum accept/reject
}
```
## Links
### Trello
[Link to your trello board](https://trello.com) or picture of your physical board
### Git
The url to your repository and to your deployed project
[Repository Link](http://github.com)
[Deploy Link](http://heroku.com)
### Slides
The url to your presentation slides
[Slides Link](http://slides.com)