from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .routers import products, sales, reports, partners, purchases, auth
from .auth import get_current_user
from .database import engine, Base
import app.models  # noqa: F401

app = FastAPI(title="Vape Inventory API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE purchases ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0"))
        conn.execute(text("ALTER TABLE sales ADD COLUMN IF NOT EXISTS cash_collected BOOLEAN NOT NULL DEFAULT TRUE"))
        conn.commit()

# Public routes — no auth required
app.include_router(auth.router)

@app.get("/health")
def health():
    return {"status": "ok"}

# Protected routes — all require valid JWT
_auth = [Depends(get_current_user)]
app.include_router(products.router, dependencies=_auth)
app.include_router(sales.router, dependencies=_auth)
app.include_router(reports.router, dependencies=_auth)
app.include_router(partners.router, dependencies=_auth)
app.include_router(purchases.router, dependencies=_auth)
