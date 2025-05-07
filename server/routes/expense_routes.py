from flask import Blueprint, request, jsonify
from database import db
from models import Expense
from flask_jwt_extended import jwt_required, get_jwt_identity

expense_bp = Blueprint('expenses', __name__)

# ✅ POST /expenses - Add a new expense for the current user
@expense_bp.route('/', methods=['POST'])
@jwt_required()
def create_expense():
    data = request.get_json()
    user_id = get_jwt_identity()

    category = data.get('category')
    amount = data.get('amount')
    description = data.get('description')
    product_id = data.get('product_id')

    if not category or amount is None:
        return jsonify({'error': 'Category and amount are required'}), 400

    try:
        expense = Expense(
            category=category,
            amount=amount,
            description=description,
            product_id=product_id,
            user_id=user_id
        )
        db.session.add(expense)
        db.session.commit()

        return jsonify({
            "id": expense.id,
            "category": expense.category,
            "amount": expense.amount,
            "description": expense.description,
            "timestamp": expense.timestamp.isoformat(),
            "product_id": expense.product_id,
            "user_id": expense.user_id
        }), 201

    except Exception as e:
        db.session.rollback()
        print("❌ Error creating expense:", e)
        return jsonify({'error': 'Expense save failed'}), 500

# ✅ GET /expenses - List all expenses for the current user
# expense_route.py (GET /expenses)
@expense_bp.route('/', methods=['GET'])
@jwt_required()
def get_expenses():
    expenses = Expense.query.order_by(Expense.timestamp.desc()).all()

    results = [{
        "id": e.id,
        "category": e.category,
        "amount": e.amount,
        "description": e.description,
        "timestamp": e.timestamp.isoformat(),
        "product_id": e.product_id,
        "product": {
            "id": e.product.id,
            "name": e.product.name
        } if e.product else None
    } for e in expenses]

    return jsonify(results), 200


# ✅ GET /expenses/<id> - Get one expense owned by the user
@expense_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_expense(id):
    user_id = get_jwt_identity()
    expense = Expense.query.get(id)

    if expense and expense.user_id == user_id:
        return jsonify({
            "id": expense.id,
            "category": expense.category,
            "amount": expense.amount,
            "description": expense.description,
            "timestamp": expense.timestamp.isoformat(),
            "product_id": expense.product_id,
            "user_id": expense.user_id
        }), 200

    return jsonify({'error': 'Expense not found or unauthorized'}), 404

# ✅ PATCH /expenses/<id> - Update an expense (only by owner)
@expense_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_expense(id):
    user_id = get_jwt_identity()
    expense = Expense.query.get(id)

    if not expense or expense.user_id != user_id:
        return jsonify({'error': 'Expense not found or unauthorized'}), 404

    data = request.get_json()
    expense.category = data.get('category', expense.category)
    expense.amount = data.get('amount', expense.amount)
    expense.description = data.get('description', expense.description)

    db.session.commit()

    return jsonify({
        "id": expense.id,
        "category": expense.category,
        "amount": expense.amount,
        "description": expense.description,
        "timestamp": expense.timestamp.isoformat(),
        "product_id": expense.product_id,
        "user_id": expense.user_id
    }), 200

# ✅ DELETE /expenses/<id> - Delete an expense (only by owner)
@expense_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_expense(id):
    user_id = get_jwt_identity()
    expense = Expense.query.get(id)

    if not expense or expense.user_id != user_id:
        return jsonify({'error': 'Expense not found or unauthorized'}), 404

    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted successfully'}), 200

# ✅ GET /expenses/product/<product_id> - Get all expenses for a product by current user
@expense_bp.route('/product/<int:product_id>', methods=['GET'])
@jwt_required()
def get_expenses_by_product(product_id):
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(product_id=product_id, user_id=user_id)\
        .order_by(Expense.timestamp.desc()).all()

    results = [{
        "id": e.id,
        "category": e.category,
        "amount": e.amount,
        "description": e.description,
        "timestamp": e.timestamp.isoformat(),
        "product_id": e.product_id,
        "user_id": e.user_id
    } for e in expenses]

    return jsonify(results), 200
