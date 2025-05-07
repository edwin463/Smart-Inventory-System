from flask import Blueprint, request, jsonify
from models import Sale, Expense, Product, User
from database import db
from sqlalchemy import func
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

report_bp = Blueprint('reports', __name__)

# Parse date range from query params
def parse_date_range():
    start = request.args.get('start')
    end = request.args.get('end')
    try:
        start_date = datetime.strptime(start, '%Y-%m-%d') if start else datetime.min
        end_date = datetime.strptime(end, '%Y-%m-%d') if end else datetime.max
        return start_date, end_date
    except ValueError:
        return None, None

# ✅ GET /reports/revenue
@report_bp.route('/revenue', methods=['GET'])
@jwt_required()
def get_total_revenue():
    start, end = parse_date_range()
    if not start:
        return jsonify({'error': 'Invalid date format'}), 400

    product_id = request.args.get('product_id', type=int)

    query = db.session.query(func.sum(Sale.total_price))\
        .filter(Sale.timestamp.between(start, end))

    if product_id:
        query = query.filter(Sale.product_id == product_id)

    total = query.scalar() or 0
    return jsonify({'total_revenue': round(total, 2)}), 200

# ✅ GET /reports/expenses
@report_bp.route('/expenses', methods=['GET'])
@jwt_required()
def get_total_expenses():
    start, end = parse_date_range()
    if not start:
        return jsonify({'error': 'Invalid date format'}), 400

    total = db.session.query(func.sum(Expense.amount))\
        .filter(Expense.timestamp.between(start, end))\
        .scalar() or 0

    return jsonify({'total_expenses': round(total, 2)}), 200

# ✅ GET /reports/profit
@report_bp.route('/profit', methods=['GET'])
@jwt_required()
def get_profit():
    start, end = parse_date_range()
    if not start:
        return jsonify({'error': 'Invalid date format'}), 400

    product_id = request.args.get('product_id', type=int)

    revenue_query = db.session.query(func.sum(Sale.total_price))\
        .filter(Sale.timestamp.between(start, end))
    if product_id:
        revenue_query = revenue_query.filter(Sale.product_id == product_id)

    revenue = revenue_query.scalar() or 0

    expense_query = db.session.query(func.sum(Expense.amount))\
        .filter(Expense.timestamp.between(start, end))
    if product_id:
        expense_query = expense_query.filter(Expense.product_id == product_id)

    expenses = expense_query.scalar() or 0

    return jsonify({
        'total_revenue': round(revenue, 2),
        'total_expenses': round(expenses, 2),
        'profit': round(revenue - expenses, 2)
    }), 200

# ✅ GET /reports/top-products
@report_bp.route('/top-products', methods=['GET'])
@jwt_required()
def top_products():
    results = (
        db.session.query(
            Product.id,
            Product.name.label("product"),
            db.func.coalesce(db.func.sum(Sale.quantity), 0).label("units_sold")
        )
        .outerjoin(Sale, Sale.product_id == Product.id)
        .group_by(Product.id)
        .order_by(db.func.sum(Sale.quantity).desc())
        .all()
    )

    data = [
        {
            "product_id": row.id,
            "product": row.product,
            "units_sold": int(row.units_sold or 0)
        } for row in results
    ]
    return jsonify(data), 200

# ✅ GET /reports/profit-summary
@report_bp.route('/profit-summary', methods=['GET'])
@jwt_required()
def profit_summary():
    start, end = parse_date_range()
    if not start:
        return jsonify({'error': 'Invalid date format'}), 400

    products = Product.query.all()
    result = []

    for product in products:
        revenue = db.session.query(func.sum(Sale.total_price)).filter(
            Sale.product_id == product.id,
            Sale.timestamp.between(start, end)
        ).scalar() or 0

        expenses = db.session.query(func.sum(Expense.amount)).filter(
            Expense.product_id == product.id,
            Expense.timestamp.between(start, end)
        ).scalar() or 0

        result.append({
            "product_id": product.id,
            "product_name": product.name,
            "total_revenue": round(revenue, 2),
            "total_expenses": round(expenses, 2),
            "profit": round(revenue - expenses, 2)
        })

    return jsonify(result), 200

# ✅ GET /reports/user-summary — Admin Only
@report_bp.route('/user-summary', methods=['GET'])
@jwt_required()
def get_admin_user_summary():
    start, end = parse_date_range()
    if not start:
        return jsonify({'error': 'Invalid date format'}), 400

    requester_id = get_jwt_identity()
    admin_user = User.query.get(requester_id)
    if not admin_user or not admin_user.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403

    users = User.query.all()
    summary = []

    for user in users:
        revenue = db.session.query(func.sum(Sale.total_price)).filter(
            Sale.user_id == user.id,
            Sale.timestamp.between(start, end)
        ).scalar() or 0

        expenses = db.session.query(func.sum(Expense.amount)).filter(
            Expense.user_id == user.id,
            Expense.timestamp.between(start, end)
        ).scalar() or 0

        summary.append({
            "user_id": user.id,
            "email": user.email,
            "total_revenue": round(revenue, 2),
            "total_expenses": round(expenses, 2),
            "profit": round(revenue - expenses, 2)
        })

    return jsonify(summary), 200

# ✅ GET /reports/user-sales/<user_id> — Admin Only
@report_bp.route('/user-sales/<int:user_id>', methods=['GET'])
@jwt_required()
def get_sales_by_user(user_id):
    requester_id = get_jwt_identity()
    requester = User.query.get(requester_id)
    if not requester or not requester.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    sales = Sale.query.filter_by(user_id=user_id).order_by(Sale.timestamp.desc()).all()
    return jsonify([
        {
            "id": sale.id,
            "product_id": sale.product_id,
            "quantity": sale.quantity,
            "total_price": sale.total_price,
            "timestamp": sale.timestamp.isoformat()
        } for sale in sales
    ]), 200
