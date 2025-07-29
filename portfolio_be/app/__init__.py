from flask import Flask

from app.config import Config, TestingConfig
from app.db_connection import db
from app.routes.asset_routes import asset_bp
from app.routes.portfolio_routes import portfolio_bp
from app.routes.user_routes import user_bp


def create_app(testing=False):
    app = Flask(__name__)

    if testing:
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(Config)

    db.init_app(app)
    api_version = app.config.get("VERSION", "v1")

    # Register blueprint
    app.register_blueprint(asset_bp, url_prefix=f"/api/{api_version}/asset")
    app.register_blueprint(portfolio_bp, url_prefix=f"/api/{api_version}/portfolio")
    app.register_blueprint(user_bp, url_prefix=f"/api/{api_version}/users")

    return app
