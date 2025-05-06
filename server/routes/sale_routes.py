# server/routes/sale_routes.py

from flask import Blueprint, request, jsonify
from database import db
from models import Sale, Product
from datetime import datetime

sale_bp = Blueprint("sales", __name__)

# POST /sales - Record a sale and calculate total
@sale_bp.route("/", methods=["POST"])
def record_sale():
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not product_id or not quantity:
        return jsonify({"error": "Missing product_id or quantity"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    if product.stock < quantity:
        return jsonify({"error": "Insufficient stock"}), 400

    try:
        # Calculate total from quantity × product.price
        total_price = round(product.price * quantity, 2)

        # Update stock
        product.stock -= quantity

        # Save sale
        sale = Sale(
            product_id=product_id,
            quantity=quantity,
            total_price=total_price,
            timestamp=datetime.utcnow()
        )
        db.session.add(sale)
        db.session.commit()

        return jsonify(sale.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# GET /sales/product/:id
@sale_bp.route("/product/<int:product_id>", methods=["GET"])
def get_sales_for_product(product_id):
    sales = Sale.query.filter_by(product_id=product_id).order_by(Sale.timestamp.desc()).all()
    return jsonify([sale.to_dict() for sale in sales]), 200 

# GET /sales/all - Return all sales with product info
@sale_bp.route("/all", methods=["GET"])
def get_all_sales():
    sales = Sale.query.order_by(Sale.timestamp.desc()).all()
    return jsonify([sale.to_dict(rules=("product",)) for sale in sales]), 200

