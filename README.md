###Project- Open to Intern : https://github.com/AyushPanday1/Open-to-intern.git

###Url shortner
### ***By this project you can shorten the long url into a simpler url code with base url.***

### Description:



<img align="right" alt="Coding" width="400" src="https://user-images.githubusercontent.com/114577936/208366880-d42dc0cb-ae0e-4455-b97c-4722a6e34d33.jpg">

Packages - Shortid , mongoose , axios , util and redis(Caching).

### Approach:
Phase 1-

It takes the long url in frontend.
Then it checks with the axios call for right url validation that exists.
It creates a unique urlcode with base url and returns it to the user.

Phase 2-

It takes the url code and after checking it in cache or mongo db it redirects you to that particular Url.

### Note :

I have used redis for caching purpose in this project for making the user interaction more powerful and time efficient.




