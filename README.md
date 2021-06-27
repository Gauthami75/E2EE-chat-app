# E2EE-Chat-Application
## Live Preview [Link For Application - Client](https://e2ee-chat-client.herokuapp.com/) deployed on Heroku
### [Link For Application - Server](https://web-chat-e2ee.herokuapp.com/) deployed on Heroku

### If this link takes too long to load try opening this few more time because in Heroku:
1. If your application is unused for a while it gets unloaded (from the server memory).
2. On the first hit it gets loaded and stays loaded until some time passes without anyone accessing it.

This is done to save server resources. If no one uses your app why keep resources busy and not let someone who really needs use them ?
If your app has a lot of continous traffic it will never be unloaded.

stackoverflow link for more https://stackoverflow.com/questions/2606190/why-are-my-basic-heroku-apps-taking-two-seconds-to-load


### End to End Encryped chat application using Elliptic Curve Dephie Hellman (ECDH) for sharing secret keys and used AES-256 GCM for message data encyption. Used React js in frontend and Node js and Express in Backend.
