from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt

# MongoDB connection URI (update with your actual password)
uri = "mongodb+srv://aryandesh15:Maths1506@cluster0.6shxrys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Confirm connection by sending a ping
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Set up a database and a collection for user data
db = client['user_database']
users_collection = db['users']

# Pydantic model for user credentials
class UserCredentials(BaseModel):
    username: str
    password: str

def register_user(username: str, plain_password: str):
    """
    Registers a new user by hashing their password and inserting
    their details into the users collection.
    """
    hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    user = {"username": username, "password": hashed_password}
    result = users_collection.insert_one(user)
    return result.inserted_id

def authenticate_user(username: str, plain_password: str):
    """
    Authenticates a user by comparing the provided password with the stored hashed password.
    """
    user = users_collection.find_one({"username": username})
    if user and bcrypt.checkpw(plain_password.encode('utf-8'), user['password']):
        return True
    else:
        return False

# Create FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace "*" with specific origins, e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
async def register(user: UserCredentials):
    # Check if user already exists
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    inserted_id = register_user(user.username, user.password)
    return {"message": "User registered successfully", "user_id": str(inserted_id)}

@app.post("/login")
async def login(user: UserCredentials):
    if authenticate_user(user.username, user.password):
        return {"message": "Login successful"}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
