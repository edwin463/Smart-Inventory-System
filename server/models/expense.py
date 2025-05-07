from app import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Expense(db.Model, SerializerMixin):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    product = db.relationship('Product', back_populates='expenses')
    user = db.relationship('User', back_populates='expenses')

    # 👇 ONLY this is safe, no nested cycles
    def serialize(self):
        return {
            'id': self.id,
            'category': self.category,
            'amount': self.amount,
            'description': self.description,
            'timestamp': self.timestamp.isoformat(),
            'product': {
                'id': self.product.id,
                'name': self.product.name,
            } if self.product else None,
            'user': {
                'id': self.user.id,
                'email': self.user.email,
            }
        }
