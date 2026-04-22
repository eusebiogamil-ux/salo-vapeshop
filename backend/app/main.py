from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import products, sales, reports, partners

app = FastAPI(title="Vape Inventory API", version="1.0.0")

import os
_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(sales.router)
app.include_router(reports.router)
app.include_router(partners.router)


@app.get("/health")
def health():
    return {"status": "ok"}
