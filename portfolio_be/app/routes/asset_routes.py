from flask import Blueprint, request, jsonify
from app.models.asset import Asset
from app import db

asset_bp = Blueprint('asset', __name__)

@asset_bp.route("/", methods=["GET"])
def get_assets():
    assets = Asset.query.all()
    return jsonify([{
        "id": a.id,
        "name": a.name,
        "category": a.category,
        "value": a.value,
        "location": a.location
    } for a in assets])

@asset_bp.route("/", methods=["POST"])
def add_asset():
    data = request.get_json()
    asset = Asset(**data)
    db.session.add(asset)
    db.session.commit()
    return jsonify({"message": "Asset added", "id": asset.id})
