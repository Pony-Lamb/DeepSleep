from .. import db_connection

db = db_connection.db


class Portfolio(db.Model):
    __tablename__ = 'portfolio'
    id = db.Column(db.Integer, primary_key=True)
    portfolio_name = db.Column(db.String(100))
    user_id = db.Column(db.Integer)
    asset_id = db.Column(db.String(50))
    quantity = db.Column(db.Integer)


class UserPortfolios(db.Model):
    __tablename__ = 'user_portfolios'   # SQL View
    user_id = db.Column(db.Integer)
    user_name = db.Column(db.String(100))
    portfolio_name = db.Column(db.String(100), primary_key=True)
