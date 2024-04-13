# Contact API SPEC

## Create Contact

Endpoint: POST /api/contact

Headers : 
- Authorization: token

Request Body : 
```json
    {
        "first_name":"David",
        "last_name":"Nasrulloh",
        "email":"david@gmail.com",
        "phone":"081554465088"
    }
```

Response Body (Success) : 
```json
    {
        "data": {
            "id": 1,
            "first_name":"David",
            "last_name":"Nasrulloh",
            "email":"david@gmail.com",
            "phone":"081554465088"
        }
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Failed create contact"
    }
```

## Get Contact

Endpoint: GET /api/contact/:contactId

Headers : 
- Authorization: token

Response Body (Success) : 
```json
    {
        "data": {
            "id": 1,
            "first_name":"David",
            "last_name":"Nasrulloh",
            "email":"david@gmail.com",
            "phone":"081554465088"
        }
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Failed get contact"
    }
```


## Update Contact

Endpoint: PUT /api/contact/:contactId

Headers : 
- Authorization: token

Request Body : 
```json
    {
        "first_name":"David",
        "last_name":"Nasrulloh",
        "email":"david@gmail.com",
        "phone":"081554465088"
    }
```

Response Body (Success) : 
```json
    {
        "data": {
            "id": 1,
            "first_name":"David",
            "last_name":"Nasrulloh",
            "email":"david@gmail.com",
            "phone":"081554465088"
        }
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Failed update contact"
    }
```

## Remove Contact

Endpoint: DELETE /api/contact/:contactId

Headers : 
- Authorization: token

Response Body (Success) : 
```json
    {
        "data": true
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Failed remove contact"
    }
```

## Search Contact

Endpoint: GET /api/contact

Headers : 
- Authorization: token

Query Params : 
- name : string, contact first name or contact last name, optional
- phone : string, contact phone, optional
- email : string, contact email, optional
- page : number, default 1
- size : number, default 10 

Response Body (Success) : 
```json
    {
        "data": [
            {
                "id": 1,
                "first_name":"David",
                "last_name":"Nasrulloh",
                "email":"david@gmail.com",
                "phone":"081554465088"
            },
            ...
        ],
        "paging" : {
            "current_page" : 1,
            "total_page" : 10,
            "size" : 10
        }
    }
```

Response Body (Failed) : 
```json
    {
        "errors": "Failed search contact"
    }
```

