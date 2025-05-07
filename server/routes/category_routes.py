from flask import Blueprint, request, jsonify
from database import db
from models import Category
from flask_jwt_extended import jwt_required

category_bp = Blueprint('categories', __name__)

# ✅ GET /categories - List all categories
@category_bp.route('/', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        "id": cat.id,
        "name": cat.name
    } for cat in categories]), 200

# ✅ POST /categories - Create a new category
@category_bp.route('/', methods=['POST'])
@jwt_required()
def create_category():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Category name is required'}), 400

    existing = Category.query.filter_by(name=name).first()
    if existing:
        return jsonify({'error': 'Category already exists'}), 400

    category = Category(name=name)
    db.session.add(category)
    db.session.commit()

    return jsonify({
        "id": category.id,
        "name": category.name
    }), 201

# ✅ GET /categories/<id> - Get one category
@category_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_category(id):
    category = Category.query.get(id)
    if category:
        return jsonify({
            "id": category.id,
            "name": category.name
        }), 200
    return jsonify({'error': 'Category not found'}), 404

# ✅ PATCH /categories/<id> - Update a category
@category_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    data = request.get_json()
    category.name = data.get('name', category.name)
    db.session.commit()

    return jsonify({
        "id": category.id,
        "name": category.name
    }), 200

# ✅ DELETE /categories/<id> - Delete a category
@category_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'}), 200
