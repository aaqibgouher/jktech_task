# JK TECH Task

To Create NodeJS web service that offers basic operations of S3.

Before you begin, ensure you have met the following requirements:

- Node.js installed
- npm or yarn installed
- Mongo DB installed

## Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-project.git
    ```
2. **Change into the project directory:**
     ```bash
    cd your-project
    ```
3. **Install dependencies:**
    ```bash
    npm install
    ```
4. **DB setup:** Make sure to check ```database/config``` file & ```.env```. Copy ```.env.example``` to ```.env``` file, Once ```.env``` is having required variables, we can start.
4. **Run the application:**
    ```bash
    npm run dev

**Once server is started, and get ```DB connected``` message in the log, we are good to go. We can then call the api's for user (register, login & logout), buckets (get, add) & objects (get, add, delete, download).**

**_NOTE:_** Added postmane collection, we can use it to make api request.
