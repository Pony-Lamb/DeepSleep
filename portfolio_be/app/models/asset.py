from .. import db_connection

db = db_connection.db


class PortfolioDailyValue(db.Model):
    __tablename__ = 'portfolio_daily_value'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    user_name = db.Column(db.String(100))
    portfolio_name = db.Column(db.String(100))
    asset_value = db.Column(db.Float)
    data_date = db.Column(db.DATE)
