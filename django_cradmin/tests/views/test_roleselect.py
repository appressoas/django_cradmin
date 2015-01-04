import htmls
import mock
from django.test import TestCase, RequestFactory
from mock_django.query import QuerySetMock

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

    def __mock_cradmin_instance(self, roles):
        cradmin_instance = mock.MagicMock()
        cradmin_instance.get_rolequeryset.return_value.count = mock.MagicMock(return_value=len(roles))
        cradmin_instance.get_rolequeryset.return_value.__len__.return_value = len(roles)
        cradmin_instance.get_titletext_for_role = lambda role: role.title
        cradmin_instance.get_roleid = lambda role: role.id
        cradmin_instance.rolefrontpage_url = lambda roleid: '/role/{}'.format(roleid)
        cradmin_instance.get_rolequeryset.return_value = QuerySetMock(None, *roles)
        return cradmin_instance

    def test_render_list_titles(self):
        role1 = mock.MagicMock()
        role1.id = 1
        role1.title = 'Role One'
        role2 = mock.MagicMock()
        role2.id = 2
        role2.title = 'Role Two'
        cradmin_instance = self.__mock_cradmin_instance(roles=[role1, role2])

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
                selector = htmls.S(response.content)

                self.assertEqual(selector.count('#django_cradmin_roleselect li'), 2)
                titletextlist = [element.alltext_normalized
                                 for element in selector.list('#django_cradmin_roleselect li h2')]
                self.assertEquals(titletextlist, ['Role One', 'Role Two'])

    def test_render_list_urls(self):
        role1 = mock.MagicMock()
        role1.id = 1
        role1.title = 'Role One'
        role2 = mock.MagicMock()
        role2.id = 2
        role2.title = 'Role Two'
        cradmin_instance = self.__mock_cradmin_instance(roles=[role1, role2])

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
                selector = htmls.S(response.content)

                urllist = [element['href']
                           for element in selector.list('#django_cradmin_roleselect li a')]
                self.assertEquals(urllist, ['/role/1', '/role/2'])

    def test_render_pagination(self):
        class CustomRoleSelectView(RoleSelectView):
            paginate_by = 3

        roles = []
        for index in xrange(CustomRoleSelectView.paginate_by + 2):
            role = mock.MagicMock()
            role.id = index
            role.title = 'Role {}'.format(index)
            roles.append(role)
        cradmin_instance = self.__mock_cradmin_instance(roles=roles)

        cradmin_instance_registry = mock.MagicMock()
        cradmin_instance_registry.get_current_instance.return_value = cradmin_instance
        with mock.patch(
                'django_cradmin.views.roleselect.cradmin_instance_registry',
                cradmin_instance_registry):
            with mock.patch(
                    'django_cradmin.templatetags.cradmin_tags.cradmin_instance_registry',
                    cradmin_instance_registry):
                request_page1 = self.factory.get('/roleselecttest')
                response_page1 = CustomRoleSelectView.as_view()(request_page1)
                self.assertEquals(response_page1.status_code, 200)
                response_page1.render()
                selector_page1 = htmls.S(response_page1.content)

                request_page2 = self.factory.get('/roleselecttest', {
                    'page': 2
                })
                response_page2 = CustomRoleSelectView.as_view()(request_page2)
                self.assertEquals(response_page2.status_code, 200)
                response_page2.render()
                selector_page2 = htmls.S(response_page2.content)

                # selector_page1.one('#django_cradmin_roleselect').prettyprint()
                self.assertEqual(selector_page1.count('#django_cradmin_roleselect li'), 3)
                self.assertEqual(selector_page2.count('#django_cradmin_roleselect li'), 2)
