from app import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0, nullable=False)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True)

    # Relationships
    category = db.relationship('Category', back_populates='products')
    supplier = db.relationship('Supplier', back_populates='products')
    sales = db.relationship('Sale', back_populates='product', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', back_populates='product', cascade='all, delete-orphan')

    # Computed property: Total quantity sold
    @hybrid_property
    def sales_count(self):
        return sum(sale.quantity for sale in self.sales or [])

    # Serializer rules to avoid recursion and keep it useful
    serialize_rules = (
        '-expenses.product',
        '-sales.product',
        '-category.products',
        '-supplier.products',
        'id', 'name', 'price', 'stock',
        'category.id', 'category.name',
        'supplier.id', 'supplier.name',
        'sales_count'  # Include this to expose the computed field
    )
