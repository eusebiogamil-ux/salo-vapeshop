from sqlalchemy.orm import Session
from ..models.product import Product
from ..schemas.product import ProductCreate, ProductUpdate, StockAdjust


def get_products(db: Session, low_stock_only: bool = False) -> list[Product]:
    q = db.query(Product).filter(Product.is_active == True)
    if low_stock_only:
        q = q.filter(Product.stock_quantity <= Product.low_stock_threshold)
    return q.order_by(Product.brand, Product.name).all()


def get_product(db: Session, product_id: int) -> Product | None:
    return db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()


def create_product(db: Session, data: ProductCreate) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product: Product, data: ProductUpdate) -> Product:
    for field, value in data.model_dump().items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


def adjust_stock(db: Session, product: Product, data: StockAdjust) -> Product:
    product.stock_quantity = data.quantity
    db.commit()
    db.refresh(product)
    return product


def soft_delete_product(db: Session, product: Product) -> Product:
    product.is_active = False
    db.commit()
    db.refresh(product)
    return product
