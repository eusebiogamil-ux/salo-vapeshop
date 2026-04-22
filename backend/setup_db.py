from app.database import Base, engine, SessionLocal
import app.models
from app.models.partner import Partner

print("Creating all tables...")
Base.metadata.create_all(engine)
print("Tables created!")

print("Adding partners...")
db = SessionLocal()
existing = db.query(Partner).count()
if existing == 0:
    db.add_all([
        Partner(name="Seb", capital=0),
        Partner(name="Romel", capital=0),
        Partner(name="Salo", capital=0),
    ])
    db.commit()
    print("Partners added: Seb, Romel, Salo")
else:
    print(f"Partners already exist ({existing} found)")
db.close()
print("Done!")
