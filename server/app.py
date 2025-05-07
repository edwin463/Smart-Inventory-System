from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from database import db, migrate 
from models import Product, Category, Supplier, Sale, Expense, User
from flask_jwt_extended import JWTManager

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Allow CORS from React frontend (localhost)
    CORS(app, supports_credentials=True, origins=[
    "http://localhost:3000",
    "https://smart-inventory-system.vercel.app"
])


    # App configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///inventory.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    # Add claims (email, is_admin) to JWT
    @jwt.additional_claims_loader
    def add_claims_to_access_token(identity):
        user = User.query.get(identity)
        return {
            "email": user.email,
            "is_admin": user.is_admin
        }

    # Register blueprints
    from routes.product_routes import product_bp
    app.register_blueprint(product_bp, url_prefix='/products/')

    from routes.category_routes import category_bp
    app.register_blueprint(category_bp, url_prefix='/categories/')

    from routes.supplier_routes import supplier_bp
    app.register_blueprint(supplier_bp, url_prefix='/suppliers/')

    from routes.expense_routes import expense_bp
    app.register_blueprint(expense_bp, url_prefix='/expenses/')

    from routes.sale_routes import sale_bp
    app.register_blueprint(sale_bp, url_prefix='/sales/')

    from routes.report_routes import report_bp
    app.register_blueprint(report_bp, url_prefix='/reports/')

    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth/')

    @app.route('/')
    def index():
        return {"message": "Smart Inventory API is running!"}

    return app
