# QUICK SWAGGER TEST DATA REFERENCE

## FAST COPY-PASTE DATA FOR SWAGGER UI

### LOGIN FIRST
```json
{"username": "admin", "password": "admin123"}
```

### REGISTER NEW USER
```json
{
  "username": "swagger_test",
  "email": "test@swagger.com", 
  "password": "test123456",
  "first_name": "Test",
  "last_name": "User"
}
```

### CREATE MEAL PLAN
```json
{
  "title": "Swagger Meal Plan",
  "type": "meal",
  "description": "Healthy meal plan for testing",
  "calories": 2000,
  "recommendations": "Drink water"
}
```

### CREATE WORKOUT
```json
{
  "title": "Swagger Workout",
  "type": "workout",
  "description": "Beginner workout routine",
  "recommendations": "Warm up first"
}
```

### CREATE COMMENT
```json
{"text": "Great plan! Very helpful."}
```

### CREATE RATING
```json
{"rating": 5}
```

### UPDATE PROFILE
```json
{
  "email": "updated@test.com",
  "first_name": "Updated"
}
```

### UPDATE POST
```json
{
  "title": "Updated Title",
  "type": "meal",
  "description": "Updated description",
  "calories": 2200
}
```

---

## TESTING SEQUENCE

1. **POST** `/api-token-auth/` → Login
2. **Authorize** in Swagger → Add token
3. **POST** `/api/posts/create/` → Create content
4. **PUT** `/api/posts/{id}/publish/` → Publish
5. **POST** `/api/posts/{id}/comments/create/` → Comment
6. **POST** `/api/posts/{id}/ratings/create/` → Rate
7. **GET** `/api/posts/public/` → Verify public access