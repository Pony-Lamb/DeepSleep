class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://user:password@localhost/assetdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "super-secret"