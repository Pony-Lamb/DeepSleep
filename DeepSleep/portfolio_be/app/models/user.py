from .. import db_connection

db = db_connection.db


class User(db.Model):
    __tablename__ = 'user_info'
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100))
    available_funds = db.Column(db.Float)
