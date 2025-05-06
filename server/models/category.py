from app import db
from sqlalchemy_serializer import SerializerMixin

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

    # One-to-many relationship
    products = db.relationship('Product', back_populates='category', cascade='all, delete-orphan')

    serialize_rules = ('-products',)
