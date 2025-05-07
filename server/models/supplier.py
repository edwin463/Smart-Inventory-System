from app import db
from sqlalchemy_serializer import SerializerMixin

class Supplier(db.Model, SerializerMixin):
    __tablename__ = 'suppliers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    contact_info = db.Column(db.String(200))

    products = db.relationship('Product', back_populates='supplier', cascade='all, delete-orphan')

    serialize_rules = (
        '-products.supplier',
    )
