# User API SPEC

## Register User 
Endpoint : POST /api/users

Request Body : 
```json
    {
        "username": "davidnasrulloh",
        "password":"rahasia",
        "name":"David Nasrulloh"
    }
```

Response Body (Success) : 
```json
    {
        "data": {
            "username": "davidnasrulloh",
            "name":"David Nasrulloh"
        }
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Username already registered"
    }
```

## Login User
Endpoint : POST /api/users/login

Request Body : 
```json
    {
        "username": "davidnasrulloh",
        "password":"rahasia",
    }
```

Response Body (Success) : 
```json
    {
        "data": {
            "username": "davidnasrulloh",
            "name":"David Nasrulloh",
            "token":"session_id_generated"
        }
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Username or password is wrong"
    }
```

## Get User
Endpoint : GET /api/users/current

Headers : 
- authorization : token

Response Body (Success) : 
```json
    {
        "data": {
            "username": "davidnasrulloh",
            "name":"David Nasrulloh",
        }
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Unauthorized"
    }
```

## Update User
Endpoint : PATCH /api/users/current

Headers : 
- authorization : token

Request Body : 
```json
    {
        "password":"rahasia", // optional
        "name":"David Nasrulloh" // optional
    }
```

Response Body (Success) : 
```json
    {
        "data": {
            "username": "davidnasrulloh",
            "name":"David Nasrulloh"
        }
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Update failed!"
    }
```

## Logout User
Endpoint : DELETE /api/users/current

Headers : 
- authorization : token

Response Body (Success) : 
```json
    {
        "data": true
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Delete failed!"
    }
```
