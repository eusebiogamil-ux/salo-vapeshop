from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.product import ProductCreate, ProductResponse, ProductResponseWithLowStock, ProductUpdate, StockAdjust
from .. import crud

router = APIRouter(prefix="/api/products", tags=["products"])


def _enrich(p) -> ProductResponseWithLowStock:
    data = {**p.__dict__}
    data["is_low_stock"] = p.stock_quantity <= p.low_stock_threshold
    return ProductResponseWithLowStock(**data)


@router.get("", response_model=list[ProductResponseWithLowStock])
def list_products(low_stock: bool = False, db: Session = Depends(get_db)):
    products = crud.product.get_products(db, low_stock_only=low_stock)
    return [_enrich(p) for p in products]


@router.post("", response_model=ProductResponseWithLowStock, status_code=201)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    product = crud.product.create_product(db, data)
    return _enrich(product)


@router.get("/{product_id}", response_model=ProductResponseWithLowStock)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.product.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _enrich(product)


@router.put("/{product_id}", response_model=ProductResponseWithLowStock)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    product = crud.product.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = crud.product.update_product(db, product, data)
    return _enrich(product)


@router.patch("/{product_id}/stock", response_model=ProductResponseWithLowStock)
def adjust_stock(product_id: int, data: StockAdjust, db: Session = Depends(get_db)):
    product = crud.product.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = crud.product.adjust_stock(db, product, data)
    return _enrich(product)


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.product.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.sales:
        raise HTTPException(status_code=409, detail="Cannot delete product with existing sales. It has been deactivated instead.")
    crud.product.soft_delete_product(db, product)
