# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    db.init_app(app)

    # 注册蓝图
    from app.routes.asset_routes import asset_bp
    app.register_blueprint(asset_bp, url_prefix="/api/assets")

    return app
