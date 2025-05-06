from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User
from database import db
from datetime import timedelta
import os

from dotenv import load_dotenv  # Load environment variables
load_dotenv()

auth_bp = Blueprint('auth', __name__)

# Load admin secret key
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY")


# ✅ POST /auth/register
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    admin_secret = data.get("admin_secret")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # Compare the admin secret
    is_admin = admin_secret == ADMIN_SECRET_KEY

    print(f">>> Registering user: {email}")
    print(f">>> Received admin_secret: {admin_secret}")
    print(f">>> Is admin assigned: {is_admin}")

    hashed_password = generate_password_hash(password)
    user = User(email=email, password_hash=hashed_password, is_admin=is_admin)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully!",
        "is_admin": user.is_admin
    }), 201


# ✅ POST /auth/login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    print(f">>> Login attempt for: {email}")

    user = User.query.filter_by(email=email).first()

    if not user:
        print("❌ No user found with that email.")
        return jsonify({"error": "Invalid credentials"}), 401

    password_match = check_password_hash(user.password_hash, password)
    print(f"🔐 Password match for {email}: {password_match}")

    if not password_match:
        print("❌ Password mismatch.")
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(days=1)
    )

    print(f"✅ Login successful for: {email} | Admin: {user.is_admin}")

    return jsonify({
        "token": access_token,
        "user": {
            "email": user.email,
            "is_admin": user.is_admin
        }
    }), 200
