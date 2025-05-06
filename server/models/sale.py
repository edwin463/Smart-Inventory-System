from app import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Sale(db.Model, SerializerMixin):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to Product
    product = db.relationship('Product', back_populates='sales') 

     # Relationship to User (accountability)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref='sales')

    serialize_rules = ('-product.sales', "product.name")
