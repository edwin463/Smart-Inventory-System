from app import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Sale(db.Model, SerializerMixin):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    product = db.relationship("Product", back_populates="sales")
    user = db.relationship("User", back_populates="sales")

    # THIS LINE BREAKS THE RECURSION 
    serialize_rules = (
        '-product.sales',
        '-user.sales',
    )
