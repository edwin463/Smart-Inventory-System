from flask import Blueprint, request, jsonify
from database import db
from models import Supplier
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required

supplier_bp = Blueprint('suppliers', __name__)

# Manual serializer function
def serialize_supplier(supplier):
    return {
        "id": supplier.id,
        "name": supplier.name,
        "contact_info": supplier.contact_info
    }

# GET /suppliers - List all suppliers
@supplier_bp.route('/', methods=['GET'])
@jwt_required()
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([serialize_supplier(s) for s in suppliers]), 200

# POST /suppliers - Create a new supplier
@supplier_bp.route('/', methods=['POST'])
@jwt_required()
def create_supplier():
    data = request.get_json()
    name = data.get('name')
    contact_info = data.get('contact_info', "")

    if not name:
        return jsonify({'error': 'Supplier name is required'}), 400

    supplier = Supplier(name=name, contact_info=contact_info)
    db.session.add(supplier)

    try:
        db.session.commit()
        return jsonify(serialize_supplier(supplier)), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Supplier name must be unique'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# GET /suppliers/<id> - Get one supplier
@supplier_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_supplier(id):
    supplier = Supplier.query.get(id)
    if supplier:
        return jsonify(serialize_supplier(supplier)), 200
    return jsonify({'error': 'Supplier not found'}), 404

# PATCH /suppliers/<id> - Update supplier
@supplier_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input provided'}), 400

    supplier.name = data.get('name', supplier.name)
    supplier.contact_info = data.get('contact_info', supplier.contact_info)

    try:
        db.session.commit()
        return jsonify(serialize_supplier(supplier)), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# DELETE /suppliers/<id> - Delete supplier
@supplier_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': 'Supplier not found'}), 404

    db.session.delete(supplier)
    db.session.commit()
    return jsonify({'message': 'Supplier deleted successfully'}), 200
