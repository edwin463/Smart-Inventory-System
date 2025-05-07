from app import db
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    # Relationships
    sales = db.relationship('Sale', back_populates='user', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', back_populates='user', cascade='all, delete-orphan')

    serialize_rules = ('-password_hash', '-sales.user', '-expenses.user', 'id', 'email')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
