from .. import db_connection

db = db_connection.db


class Asset(db.Model):
    __tablename__ = "assets"
    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.String(50))
    asset_name = db.Column(db.String(100))
    open_price = db.Column(db.Float)
    high_price = db.Column(db.Float)
    low_price = db.Column(db.Float)
    close_price = db.Column(db.Float)
    category = db.Column(db.String(50))
    data_date = db.Column(db.Date)


class PortfolioDailyValue(db.Model):
    __tablename__ = 'portfolio_daily_value'  # SQL View
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    user_name = db.Column(db.String(100))
    portfolio_name = db.Column(db.String(100))
    asset_value = db.Column(db.Float)
    data_date = db.Column(db.DATE)
