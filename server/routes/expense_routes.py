from flask import Blueprint, request, jsonify
from database import db
from models import Expense
from sqlalchemy.exc import IntegrityError

expense_bp = Blueprint('expenses', __name__)

# GET /expenses - List all
@expense_bp.route('/', methods=['GET'])
def get_expenses():
    expenses = Expense.query.order_by(Expense.timestamp.desc()).all()
    return jsonify([expense.to_dict() for expense in expenses]), 200

# POST /expenses - Add new
@expense_bp.route('/', methods=['POST'])
def create_expense():
    data = request.get_json()
    category = data.get('category')
    amount = data.get('amount')
    description = data.get('description')
    product_id = data.get('product_id')

    if not category or amount is None:
        return jsonify({'error': 'Category and amount are required'}), 400

    try:
        expense = Expense(category=category, amount=amount, description=description, product_id = product_id)
        db.session.add(expense)
        db.session.commit()
        return jsonify(expense.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# GET /expenses/<id>
@expense_bp.route('/<int:id>', methods=['GET'])
def get_expense(id):
    expense = Expense.query.get(id)
    if expense:
        return jsonify(expense.to_dict()), 200
    return jsonify({'error': 'Expense not found'}), 404

# PATCH /expenses/<id>
@expense_bp.route('/<int:id>', methods=['PATCH'])
def update_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404

    data = request.get_json()
    expense.category = data.get('category', expense.category)
    expense.amount = data.get('amount', expense.amount)
    expense.description = data.get('description', expense.description)

    db.session.commit()
    return jsonify(expense.to_dict()), 200

# DELETE /expenses/<id>
@expense_bp.route('/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({'error': 'Expense not found'}), 404

    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted successfully'}), 200

# GET /expenses/product/<product_id> - Get all expenses for a product
@expense_bp.route('/product/<int:product_id>', methods=['GET'])
def get_expenses_by_product(product_id):
    expenses = Expense.query.filter_by(product_id=product_id).order_by(Expense.timestamp.desc()).all()
    return jsonify([e.to_dict() for e in expenses]), 200
