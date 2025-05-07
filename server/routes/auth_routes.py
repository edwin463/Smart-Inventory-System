from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User
from database import db
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__)
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY")

# ✅ POST /auth/register
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password")
    admin_secret = data.get("admin_secret")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    is_admin = admin_secret == ADMIN_SECRET_KEY
    hashed_password = generate_password_hash(password)

    user = User(email=email, password_hash=hashed_password, is_admin=is_admin)

    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
    return jsonify({
        "message": "User registered successfully!",
        "token": access_token,
        "user": {
            "email": user.email,
            "is_admin": user.is_admin
        }
    }), 201

# ✅ POST /auth/login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
    return jsonify({
        "token": access_token,
        "user": {
            "email": user.email,
            "is_admin": user.is_admin
        }
    }), 200

# ✅ GET /auth/users - Admin Only
@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def list_all_users():
    current_user = User.query.get(get_jwt_identity())
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403

    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "email": u.email,
        "is_admin": u.is_admin
    } for u in users]), 200
