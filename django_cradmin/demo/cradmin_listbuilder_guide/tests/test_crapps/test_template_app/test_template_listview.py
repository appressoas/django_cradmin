from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.template_app import template_listview


class TestTemplateListview(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = template_listview.TemplateListbuilderView

    def __set_cradmin_role(self):
        return mommy.make('cradmin_listbuilder_guide.Album')

    def test_render_form_sanity(self):
        album = self.__set_cradmin_role()
        mommy.make('cradmin_listbuilder_guide.Song', album=album)
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
        mockresponse.selector.prettyprint()