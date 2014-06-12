import mock
from django.test import TestCase, RequestFactory

from django_cradmin.views.roleselect import RoleSelectView


class TestRoleSelectView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_302_redirect_on_single_role(self):
        cradmin_instance = mock.MagicMock()
        cradmin_instance.get_rolequeryset.return_value.count = mock.MagicMock(return_value=1)
        cradmin_instance_registry = mock.MagicMock()
        cradmin_instance_registry.get_current_instance.return_value = cradmin_instance
        with mock.patch(
                'django_cradmin.views.roleselect.cradmin_instance_registry',
                cradmin_instance_registry):
            request = self.factory.get('/roleselecttest')
            response = RoleSelectView.as_view()(request)
            self.assertEquals(response.status_code, 302)

    def test_200_on_multiple(self):
        cradmin_instance = mock.MagicMock()
        cradmin_instance.get_rolequeryset.return_value.count = mock.MagicMock(return_value=2)
        cradmin_instance_registry = mock.MagicMock()
        cradmin_instance_registry.get_current_instance.return_value = cradmin_instance
        with mock.patch(
                'django_cradmin.views.roleselect.cradmin_instance_registry',
                cradmin_instance_registry):
            request = self.factory.get('/roleselecttest')
            response = RoleSelectView.as_view()(request)
            self.assertEquals(response.status_code, 200)

    def test_render_list(self):
        cradmin_instance = mock.MagicMock()
        cradmin_instance.get_rolequeryset.return_value.count = mock.MagicMock(return_value=2)
        cradmin_instance.get_rolequeryset.return_value.__len__.return_value = 2
        cradmin_instance.get_titletext_for_role = lambda role: role.title
        cradmin_instance.get_roleid = lambda role: role.id
        cradmin_instance.rolefrontpage_url = lambda roleid: '/role/{}'.format(roleid)
        role1 = mock.MagicMock()
        role1.id = 1
        role1.title = 'Role One'
        role2 = mock.MagicMock()
        role2.id = 2
        role2.title = 'Role Two'
        cradmin_instance.get_rolequeryset.return_value.__iter__.return_value = iter([role1, role2])
        cradmin_instance_registry = mock.MagicMock()
        cradmin_instance_registry.get_current_instance.return_value = cradmin_instance
        with mock.patch(
                'django_cradmin.views.roleselect.cradmin_instance_registry',
                cradmin_instance_registry):
            with mock.patch(
                    'django_cradmin.templatetags.cradmin_tags.cradmin_instance_registry',
                    cradmin_instance_registry):
                request = self.factory.get('/roleselecttest')
                response = RoleSelectView.as_view()(request)
                self.assertEquals(response.status_code, 200)
                response.render()
                self.assertIn('Role One', response.content)
                self.assertIn('Role Two', response.content)
                self.assertIn('/role/1', response.content)
                self.assertIn('/role/2', response.content)