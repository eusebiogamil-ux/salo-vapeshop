from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .routers import products, sales, reports, partners, purchases, credits
from .database import engine, Base
import app.models  # noqa: F401 — ensures all models are registered

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
    # Safe column migrations
    with engine.connect() as conn:
        conn.execute(text(
            "ALTER TABLE purchases ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0"
        ))
        conn.commit()

app.include_router(products.router)
app.include_router(sales.router)
app.include_router(reports.router)
app.include_router(partners.router)
app.include_router(purchases.router)
app.include_router(credits.router)


@app.get("/health")
def health():
    return {"status": "ok"}
