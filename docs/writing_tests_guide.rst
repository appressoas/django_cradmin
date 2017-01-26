############################################################
Writing tests - writing tests for cradmin instances and apps
############################################################

.. _writing_tests_guide:

Writing tests for a CrInstance
==============================

Like this::

    from unittest import mock

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from exampledjangoapps.exampleapp_dummyname.crinstances.crinstance_question import QuestionCrAdminInstance


    class TestQuestionCrAdminInstance(TestCase):

        def test_user_that_is_not_superuser_makes_rolequeryset_empty(self):
            mommy.make('exampleapp_dummyname.Question')
            mockrequest = mock.MagicMock()
            mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
            crinstance = QuestionCrAdminInstance(request=mockrequest)
            self.assertEqual(0, len(crinstance.get_rolequeryset().all()))


Writing tests for a CrApp
=========================
