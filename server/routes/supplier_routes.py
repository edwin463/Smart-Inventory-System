from flask import Blueprint, request, jsonify
from database import db
from models import Supplier
from sqlalchemy.exc import IntegrityError

supplier_bp = Blueprint('suppliers', __name__)

# GET /suppliers - List all suppliers
@supplier_bp.route('/', methods=['GET'])
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([supplier.to_dict() for supplier in suppliers]), 200

# POST /suppliers - Create a new supplier
@supplier_bp.route('/', methods=['POST'])
def create_supplier():
    data = request.get_json()
    name = data.get('name')
    contact_info = data.get('contact_info')

    if not name:
        return jsonify({'error': 'Supplier name is required'}), 400

    supplier = Supplier(name=name, contact_info=contact_info)
    db.session.add(supplier)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Supplier name must be unique'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify(supplier.to_dict()), 201

# GET /suppliers/<id> - Get one supplier
@supplier_bp.route('/<int:id>', methods=['GET'])
def get_supplier(id):
    supplier = Supplier.query.get(id)
    if supplier:
        return jsonify(supplier.to_dict()), 200
    return jsonify({'error': 'Supplier not found'}), 404

# PATCH /suppliers/<id> - Update supplier
@supplier_bp.route('/<int:id>', methods=['PATCH'])
def update_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input provided'}), 400

    supplier.name = data.get('name', supplier.name)
    supplier.contact_info = data.get('contact_info', supplier.contact_info)

    db.session.commit()
    return jsonify(supplier.to_dict()), 200

# DELETE /suppliers/<id> - Delete supplier
@supplier_bp.route('/<int:id>', methods=['DELETE'])
def delete_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 404

    db.session.delete(supplier)
    db.session.commit()
    return jsonify({'message': 'Supplier deleted successfully'}), 200
