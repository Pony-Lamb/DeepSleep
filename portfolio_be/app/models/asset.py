from .. import db_connection

db = db_connection.db


class Asset(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    category = db.Column(db.String(64))
    value = db.Column(db.Float)
    location = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
