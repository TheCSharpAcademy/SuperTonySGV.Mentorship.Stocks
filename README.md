```markdown
# Stock Data Downloader

A web application to download stock data from Polygon.io.

## Table of Contents

- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)

## Installation

### Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```
2. Navigate to the backend directory:
    ```bash
    cd your-repository/backend
    ```
3. Install dependencies and build the project:
    ```bash
    dotnet restore
    dotnet build
    ```
4. Set up the database and run migrations:
    ```bash
    dotnet ef database update
    ```
5. Run the API:
    ```bash
    dotnet run
    ```

### Frontend Setup
1. Open frontend folder in Visual Studio Code (or other IDE, or VSCode)
2. Open terminal and run npm run start (I'm using node v 20.12.2)

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Register or log in using your credentials. Signup for Polygon API key free here https://polygon.io/dashboard/signup.
3. Add, import, and manage stock symbols.
4. Click download button to download stock data in CSV format.
