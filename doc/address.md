# Address API SPEC

## Create Address
Endpoint : POST /api/contact/:contactId/address

Headers : 
- Authorization : token

Request Body : 
```json
    {
        "street":"jalan contoh, optional",
        "city":"Kota, optional",
        "province":"Provinsi, optional",
        "country":"Negara Apa",
        "postal_code":"123123"
    }
```

Response Body : 
```json
    {
        "data": {
            "id": 1,
            "street":"jalan contoh, optional",
            "city":"Kota, optional",
            "province":"Provinsi, optional",
            "country":"Negara Apa",
            "postal_code":"123123"
        }
    }
```

## Get Address

Endpoint : GET /api/contact/:contactId/address/:addressId

Headers : 
- Authorization : token

Response Body : 
```json
    {
        "data": {
            "id": 1,
            "street":"jalan contoh, optional",
            "city":"Kota, optional",
            "province":"Provinsi, optional",
            "country":"Negara Apa",
            "postal_code":"123123"
        }
    }
```

## Update Address 

Endpoint : PUT /api/contact/:contactId/address/:addressId

Headers : 
- Authorization : token

Request Body : 
```json
    {
        "street":"jalan contoh, optional",
        "city":"Kota, optional",
        "province":"Provinsi, optional",
        "country":"Negara Apa",
        "postal_code":"123123"
    }
```

Response Body : 
```json
    {
        "data": {
            "id": 1,
            "street":"jalan contoh, optional",
            "city":"Kota, optional",
            "province":"Provinsi, optional",
            "country":"Negara Apa",
            "postal_code":"123123"
        }
    }
```

## Remove Address

Endpoint : DELETE /api/contact/:contactId/address

Headers : 
- Authorization : token

Response Body : 
```json
    {
        "data": true
    }
```

## List Address

Endpoint : GET /api/contact/:contactId/address

Headers : 
- Authorization : token

Response Body : 
```json
    {
        "data": [
            {
                "id": 1,
                "street":"jalan contoh, optional",
                "city":"Kota, optional",
                "province":"Provinsi, optional",
                "country":"Negara Apa",
                "postal_code":"123123"
            },
            ...
        ]
    }
```

