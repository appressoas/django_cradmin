from django.contrib.auth.models import User
from django.test import TestCase
from django_cradmin.apps.cradmin_register_account.forms.auth_user_form import AuthUserCreateAccountWithUsernameForm
from django_cradmin.tests.helpers import create_user


class TestAuthUserCreateAccountWithUsernameForm(TestCase):
    def test_is_valid(self):
        form = AuthUserCreateAccountWithUsernameForm({
            'username': 'test',
            'password1': 'test',
            'password2': 'test',
            'email': 'test@example.com'
        })
        self.assertTrue(form.is_valid())

    def test_save(self):
        form = AuthUserCreateAccountWithUsernameForm({
            'username': 'test',
            'password1': 'test',
            'password2': 'test',
            'email': 'test@example.com'
        })
        form.is_valid()
        self.assertEquals(User.objects.count(), 0)
        form.save()
        self.assertEquals(User.objects.count(), 1)
        created_user = User.objects.first()
        self.assertEqual(created_user.username, 'test')
        self.assertEqual(created_user.email, 'test@example.com')
        self.assertTrue(created_user.has_usable_password())
        self.assertTrue(created_user.check_password('test'))

    def test_passwords_do_not_match(self):
        form = AuthUserCreateAccountWithUsernameForm({
            'username': 'unused',
            'password1': 'test1',
            'password2': 'test2',
            'email': 'unused@example.com'
        })
        self.assertFalse(form.is_valid())
        self.assertEquals(form.non_field_errors(), [u'The passwords do not match.'])

    def test_email_is_not_unique(self):
        create_user('testuser', email='test@example.com')
        form = AuthUserCreateAccountWithUsernameForm({
            'username': 'unused',
            'password1': 'unused',
            'password2': 'unused',
            'email': 'test@example.com'
        })
        self.assertFalse(form.is_valid())
        self.assertEquals(form.errors, {
            'email': [u'Account with this email address already exists.']
        })

    def test_username_is_not_unique(self):
        create_user('test')
        form = AuthUserCreateAccountWithUsernameForm({
            'username': 'test',
            'password1': 'unused',
            'password2': 'unused',
            'email': 'unused@example.com'
        })
        self.assertFalse(form.is_valid())
        self.assertEquals(form.errors, {
            'username': [u'User with this Username already exists.']
        })

