from faker import Faker
from random import randint, choice, uniform
from database import db
from app import create_app
from models import Category, Supplier, Product, Expense, Sale
from datetime import datetime, timedelta

fake = Faker()
app = create_app()

with app.app_context():
    # Clear tables
    Sale.query.delete()
    Expense.query.delete()
    Product.query.delete()
    Category.query.delete()
    Supplier.query.delete()
    db.session.commit()

    # Seed Categories
    categories = []
    for _ in range(5):
        cat = Category(name=fake.unique.word().capitalize())
        db.session.add(cat)
        categories.append(cat)

    # Seed Suppliers
    suppliers = []
    for _ in range(5):
        supplier = Supplier(name=fake.company(), contact_info=fake.email())
        db.session.add(supplier)
        suppliers.append(supplier)

    # Seed Products
    products = []
    for _ in range(10):
        product = Product(
            name=fake.word().capitalize(),
            price=round(uniform(10, 500), 2),
            stock=randint(5, 50),
            category=choice(categories),
            supplier=choice(suppliers)
        )
        db.session.add(product)
        products.append(product)

    # Seed Expenses
    for _ in range(10):
        expense = Expense(
            category=fake.word().capitalize(),
            amount=round(uniform(100, 1000), 2),
            description=fake.sentence(nb_words=5),
            timestamp=fake.date_time_between(start_date='-30d', end_date='now')
        )
        db.session.add(expense)

    # Seed Sales
    for _ in range(15):
        product = choice(products)
        quantity = randint(1, 3)
        if product.stock >= quantity:
            sale = Sale(
                product=product,
                quantity=quantity,
                total_price=round(product.price * quantity, 2),
                timestamp=fake.date_time_between(start_date='-20d', end_date='now')
            )
            product.stock -= quantity
            db.session.add(sale)

    db.session.commit()
    print("✅ Database seeded successfully!")
