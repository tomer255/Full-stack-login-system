# Full stack login system
This project is a part of an academic course.
We were tasked to simulate the differences between a vulnerable and a secured implementation of similar web servers.

# Running Instructions

## Certificate Generation
In order to run this project you need to generate certificate.
You can generate certificate using the following OpenSSL commands:
- `cd server`
- `mkdir cert && cd cert`
- `openssl genrsa -out key.pem 2048`
- `openssl req -new -sha256 -key key.pem -out csr.pem`
- `openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem`

For further explanation you can visit https://nodejs.org/api/tls.html

---

## Set Environment Variables
- PORT - Server port
- FRONT_URL - Base front URL 
- DB_USER - MySQL Database user name
- DB_HOST - MySQL host
- DB_PASSWORD - MySQL password
- DB_NAME - Name of the database
- EMAIL_ADDRESS - Outlook email address for maintanance purposes (Password reset)
- EMAIL_PASSWORD - Password for the `EMAIL_ADDRESS`
- TOKEN_KEY - Secret key for `JWT` (JSONWebToken)