<h2>APIs Implemented</h2>
[Done] Accept user question, and return AI-generated answer.<br>
[Done] Retrieve specific question and answer by question ID.<br>
[Done] Create a new user account.<br>
[Done] Retrieve a user profile with a given userId<br>
[Done] Retrieve all questions asked by user with a given userId<br>
[Done] User login endpoint. <br>
[Done] User logout endpoint.<br>
[Done] Refresh access token endpoint.<br>



<h2>Command To Run Dockerfile</h2>

- `docker build -t prkskrs-test-backend .`
- `docker run -d --env-file .env -p 8000:8000 prkskrs-test-backend`