# File-Upload-Service

Upload service for files that returns a signed URL stored in AWS S3 Blob storage distributed through AWS CloudFront. The signed URL will expire in 24 hours (which can be configurable) in timeToAdd


### How to run

Requires a 2048 RSA private and public keys that can be generated in a /keys folder in server
```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
``` 

Copy .env.template to .env and enter the remaining environment values

Run 
```
npm ci
npm start
```