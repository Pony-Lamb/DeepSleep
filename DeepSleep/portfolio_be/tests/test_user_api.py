import unittest
from app import create_app, db
from app.models.user import User


class UserApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(testing=True)
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()
            user = User(user_id=1, user_name="Kiki", available_funds=1000.0)
            db.session.add(user)
            db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.drop_all()

    def test_get_user_success(self):
        response = self.client.get("/api/v1/users/1")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["data"]["user_id"], 1)
        self.assertEqual(data["data"]["name"], "Kiki")

    def test_get_user_not_found(self):
        response = self.client.get("/api/v1/users/999")
        self.assertEqual(response.status_code, 404)
        self.assertIn("Invalid user.", response.get_json()["message"])


if __name__ == '__main__':
    unittest.main()
