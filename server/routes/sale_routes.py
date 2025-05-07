from flask import Blueprint, request, jsonify
from database import db
from models import Sale, Product, User
from datetime import datetime
from flask_jwt_extended import jwt_required
from flask_jwt_extended import jwt_required, get_jwt_identity

sale_bp = Blueprint("sales", __name__)

def serialize_sale(sale):
    return {
        "id": sale.id,
        "quantity": sale.quantity,
        "total_price": sale.total_price,
        "timestamp": sale.timestamp.isoformat(),
        "product_id": sale.product_id,
        "product": {
            "id": sale.product.id,
            "name": sale.product.name
        } if sale.product else None,
        "user_id": sale.user_id,
        "user_email": sale.user.email if sale.user else None
    }

# ✅ POST /sales
@sale_bp.route("/", methods=["POST"])
@jwt_required()
def record_sale():
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity")
    user_id = get_jwt_identity()

    if not product_id or not quantity:
        return jsonify({"error": "Missing product_id or quantity"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if product.stock < quantity:
        return jsonify({"error": "Insufficient stock"}), 400

    try:
        total_price = round(product.price * quantity, 2)
        product.stock -= quantity

        sale = Sale(
            product_id=product_id,
            quantity=quantity,
            total_price=total_price,
            timestamp=datetime.utcnow(),
            user_id=user_id
        )

        db.session.add(sale)
        db.session.commit()

        return jsonify(serialize_sale(sale)), 201

    except Exception as e:
        db.session.rollback()
        print("❌ Error creating sale:", e)
        return jsonify({"error": "Sale failed"}), 500

# ✅ GET /sales/product/<product_id>
@sale_bp.route("/product/<int:product_id>", methods=["GET"])
@jwt_required()
def get_sales_for_product(product_id):
    sales = Sale.query.filter_by(product_id=product_id).order_by(Sale.timestamp.desc()).all()
    return jsonify([serialize_sale(s) for s in sales]), 200

# ✅ GET /sales/all
@sale_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_sales():
    try:
        sales = Sale.query.order_by(Sale.timestamp.desc()).all()
        return jsonify([serialize_sale(s) for s in sales]), 200
    except Exception as e:
        print("❌ Error in /sales/all:", e)
        return jsonify({"error": "Failed to load sales"}), 500
