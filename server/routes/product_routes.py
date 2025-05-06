from flask import Blueprint, request, jsonify
from database import db
from models import Product, Category, Supplier

product_bp = Blueprint('products', __name__) 

# GET /products - List all products
@product_bp.route('/', methods=['GET'])
def get_all_products():
    products = Product.query.order_by(Product.id.desc()).all()
    return jsonify([p.to_dict(rules=('category', 'supplier', 'sales')) for p in products]), 200


# GET /products - List all products
@product_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)
    if product:
        return jsonify(product.to_dict(rules=('category', 'supplier'))), 200
    return jsonify({'error': 'Product not found'}), 404

# POST /products - Create a new product using category_name and supplier_name only
@product_bp.route('/', methods=['POST'])
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

    # Create category if only name is provided
    if not category_id and category_name:
        category = Category.query.filter_by(name=category_name).first()
        if not category:
            category = Category(name=category_name)
            db.session.add(category)
            db.session.commit()
        category_id = category.id

    # Create supplier if only name is provided
    if not supplier_id and supplier_name:
        supplier = Supplier.query.filter_by(name=supplier_name).first()
        if not supplier:
            supplier = Supplier(name=supplier_name, contact_info="")
            db.session.add(supplier)
            db.session.commit()
        supplier_id = supplier.id

    # Validate essential fields
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
        full_product = Product.query.get(new_product.id)
        return jsonify(full_product.to_dict(rules=("category", "supplier"))), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500 
    

@product_bp.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'}), 200

