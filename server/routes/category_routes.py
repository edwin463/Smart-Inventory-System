from flask import Blueprint, request, jsonify
from database import db
from models import Category

category_bp = Blueprint('categories', __name__)

# GET /categories - List all categories
@category_bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories]), 200

# POST /categories - Create a new category
@category_bp.route('/', methods=['POST'])
def create_category():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Category name is required'}), 400

    category = Category(name=name)
    db.session.add(category)
    db.session.commit()

    return jsonify(category.to_dict()), 201

# GET /categories/<id> - Get one category
@category_bp.route('/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get(id)
    if category:
        return jsonify(category.to_dict()), 200
    return jsonify({'error': 'Category not found'}), 404

# PATCH /categories/<id> - Update category
@category_bp.route('/<int:id>', methods=['PATCH'])
def update_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input provided'}), 400

    category.name = data.get('name', category.name)
    db.session.commit()
    return jsonify(category.to_dict()), 200

# DELETE /categories/<id> - Delete category
@category_bp.route('/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted successfully'}), 200
