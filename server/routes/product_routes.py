from flask import Blueprint, request, jsonify
from database import db
from models import Product, Category, Supplier
from flask_jwt_extended import jwt_required

product_bp = Blueprint('products', __name__)

# ✅ GET /products - List all products
@product_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    try:
        products = Product.query.all()

        product_list = []
        for product in products:
            product_dict = {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "stock": product.stock,
                "category": {
                    "id": product.category.id,
                    "name": product.category.name
                } if product.category else None,
                "supplier": {
                    "id": product.supplier.id,
                    "name": product.supplier.name,
                    "contact_info": product.supplier.contact_info
                } if product.supplier else None,
                "sales_count": sum(s.quantity for s in product.sales)
            }
            product_list.append(product_dict)

        return jsonify(product_list), 200

    except Exception as e:
        print("❌ Error in /products:", e)
        return jsonify({"error": str(e)}), 500

# ✅ GET /products/<id> - Get a single product
@product_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_product(id):
    try:
        product = Product.query.get_or_404(id)

        product_data = {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "stock": product.stock,
            "sales_count": product.sales_count,
            "category": {
                "id": product.category.id,
                "name": product.category.name
            } if product.category else None,
            "supplier": {
                "id": product.supplier.id,
                "name": product.supplier.name,
                "contact_info": product.supplier.contact_info
            } if product.supplier else None
        }

        return jsonify(product_data), 200

    except Exception as e:
        print(f"❌ Failed to load product {id}: {e}")
        return jsonify({"error": str(e)}), 500

# ✅ POST /products - Create a product
@product_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json()
    print("📥 Received data:", data)

    name = data.get("name")
    price = data.get("price")
    stock = data.get("stock", 0)

    category_id = data.get("category_id")
    category_name = data.get("category_name")

    supplier_id = data.get("supplier_id")
    supplier_name = data.get("supplier_name")

    # Auto-create or fetch category if category_id is missing
    if not category_id and category_name:
        category = Category.query.filter_by(name=category_name).first()
        if not category:
            category = Category(name=category_name)
            db.session.add(category)
            db.session.commit()
        category_id = category.id

    # Auto-create or fetch supplier if supplier_id is missing
    if not supplier_id and supplier_name:
        supplier = Supplier.query.filter_by(name=supplier_name).first()
        if not supplier:
            supplier = Supplier(name=supplier_name, contact_info="")
            db.session.add(supplier)
            db.session.commit()
        supplier_id = supplier.id

    if not name or price is None or category_id is None:
        return jsonify({"error": "Missing one of: name, price, or category"}), 400

    try:
        new_product = Product(
            name=name,
            price=price,
            stock=stock,
            category_id=category_id,
            supplier_id=supplier_id
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            "id": new_product.id,
            "name": new_product.name,
            "price": new_product.price,
            "stock": new_product.stock,
            "category": {
                "id": new_product.category.id,
                "name": new_product.category.name
            } if new_product.category else None,
            "supplier": {
                "id": new_product.supplier.id,
                "name": new_product.supplier.name,
                "contact_info": new_product.supplier.contact_info
            } if new_product.supplier else None
        }), 201

    except Exception as e:
        db.session.rollback()
        print("❌ Error creating product:", e)
        return jsonify({"error": str(e)}), 500

# ✅ DELETE /products/<id> - Delete a product
@product_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
