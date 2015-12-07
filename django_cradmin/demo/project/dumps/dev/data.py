#!/usr/bin/env python
# -*- coding: utf-8 -*-

# This file has been automatically generated.
# Instead of changing it, create a file called import_helper.py
# and put there a class called ImportHelper(object) in it.
#
# This class will be specially casted so that instead of extending object,
# it will actually extend the class BasicImportHelper()
#
# That means you just have to overload the methods you want to
# change, leaving the other ones inteact.
#
# Something that you might want to do is use transactions, for example.
#
# Also, don't forget to add the necessary Django imports.
#
# This file was generated with the following command:
# manage.py dumpscript auth.User webdemo listfilterdemo --traceback
#
# to restore it, run
# manage.py runscript module_name.this_script_name
#
# example: if manage.py is at ./manage.py
# and the script is at ./some_folder/some_script.py
# you must make sure ./some_folder/__init__.py exists
# and run  ./manage.py runscript some_folder.some_script
import os, sys
from django.db import transaction

class BasicImportHelper(object):

    def pre_import(self):
        pass

    # You probably want to uncomment on of these two lines
    # @transaction.atomic  # Django 1.6
    # @transaction.commit_on_success  # Django <1.6
    def run_import(self, import_data):
        import_data()

    def post_import(self):
        pass

    def locate_similar(self, current_object, search_data):
        # You will probably want to call this method from save_or_locate()
        # Example:
        #   new_obj = self.locate_similar(the_obj, {"national_id": the_obj.national_id } )

        the_obj = current_object.__class__.objects.get(**search_data)
        return the_obj

    def locate_object(self, original_class, original_pk_name, the_class, pk_name, pk_value, obj_content):
        # You may change this function to do specific lookup for specific objects
        #
        # original_class class of the django orm's object that needs to be located
        # original_pk_name the primary key of original_class
        # the_class      parent class of original_class which contains obj_content
        # pk_name        the primary key of original_class
        # pk_value       value of the primary_key
        # obj_content    content of the object which was not exported.
        #
        # You should use obj_content to locate the object on the target db
        #
        # An example where original_class and the_class are different is
        # when original_class is Farmer and the_class is Person. The table
        # may refer to a Farmer but you will actually need to locate Person
        # in order to instantiate that Farmer
        #
        # Example:
        #   if the_class == SurveyResultFormat or the_class == SurveyType or the_class == SurveyState:
        #       pk_name="name"
        #       pk_value=obj_content[pk_name]
        #   if the_class == StaffGroup:
        #       pk_value=8

        search_data = { pk_name: pk_value }
        the_obj = the_class.objects.get(**search_data)
        #print(the_obj)
        return the_obj


    def save_or_locate(self, the_obj):
        # Change this if you want to locate the object in the database
        try:
            the_obj.save()
        except:
            print("---------------")
            print("Error saving the following object:")
            print(the_obj.__class__)
            print(" ")
            print(the_obj.__dict__)
            print(" ")
            print(the_obj)
            print(" ")
            print("---------------")

            raise
        return the_obj


importer = None
try:
    import import_helper
    # We need this so ImportHelper can extend BasicImportHelper, although import_helper.py
    # has no knowlodge of this class
    importer = type("DynamicImportHelper", (import_helper.ImportHelper, BasicImportHelper ) , {} )()
except ImportError as e:
    # From Python 3.3 we can check e.name - string match is for backward compatibility.
    if 'import_helper' in str(e):
        importer = BasicImportHelper()
    else:
        raise

import datetime
from decimal import Decimal
from django.contrib.contenttypes.models import ContentType

try:
    import dateutil.parser
except ImportError:
    print("Please install python-dateutil")
    sys.exit(os.EX_USAGE)

def run():
    importer.pre_import()
    importer.run_import(import_data)
    importer.post_import()

def import_data():
    # Initial Imports

    # Processing model: User

    from django.contrib.auth.models import User

    auth_user_1 = User()
    auth_user_1.password = 'pbkdf2_sha256$12000$mpmHCSXO9NTh$+9NHvk8NgKDHpa4IzFp1h5VPg76JM3I2aoH4JYl6xkQ='
    auth_user_1.last_login = dateutil.parser.parse("2015-12-06T21:10:23.711113+00:00")
    auth_user_1.is_superuser = True
    auth_user_1.username = 'grandma'
    auth_user_1.first_name = ''
    auth_user_1.last_name = ''
    auth_user_1.email = 'grandma@example.com'
    auth_user_1.is_staff = True
    auth_user_1.is_active = True
    auth_user_1.date_joined = dateutil.parser.parse("2014-06-19T10:52:07.105000+00:00")
    auth_user_1 = importer.save_or_locate(auth_user_1)

    auth_user_2 = User()
    auth_user_2.password = 'pbkdf2_sha256$12000$WDKBtrzeNHNO$eqG363O2TyX6F8SiH44/r0d199ywq+JSJSufnFbNDnE='
    auth_user_2.last_login = dateutil.parser.parse("2015-12-07T02:55:00+00:00")
    auth_user_2.is_superuser = False
    auth_user_2.username = 'peterpan'
    auth_user_2.first_name = 'Peter'
    auth_user_2.last_name = 'Pan'
    auth_user_2.email = 'peterpan@example.com'
    auth_user_2.is_staff = False
    auth_user_2.is_active = True
    auth_user_2.date_joined = dateutil.parser.parse("2015-12-07T02:55:00+00:00")
    auth_user_2 = importer.save_or_locate(auth_user_2)

    auth_user_3 = User()
    auth_user_3.password = 'pbkdf2_sha256$12000$gLiIktdF3GzI$0vEtSoZPkSbYVPp1EkBEbgqv6HfQNDKoPbNNnzfo9eE='
    auth_user_3.last_login = dateutil.parser.parse("2015-12-07T02:56:00+00:00")
    auth_user_3.is_superuser = False
    auth_user_3.username = 'dewey'
    auth_user_3.first_name = ''
    auth_user_3.last_name = ''
    auth_user_3.email = 'dewey@example.com'
    auth_user_3.is_staff = False
    auth_user_3.is_active = True
    auth_user_3.date_joined = dateutil.parser.parse("2015-12-07T02:56:00+00:00")
    auth_user_3 = importer.save_or_locate(auth_user_3)

    # Processing model: Site

    from django_cradmin.demo.webdemo.models import Site

    webdemo_site_1 = Site()
    webdemo_site_1.name = 'Demosite'
    webdemo_site_1.description = 'A demo site'
    webdemo_site_1 = importer.save_or_locate(webdemo_site_1)

    webdemo_site_1.admins.add(auth_user_1)

    webdemo_site_2 = Site()
    webdemo_site_2.name = 'Comicbook store'
    webdemo_site_2.description = 'The local comicbook store'
    webdemo_site_2 = importer.save_or_locate(webdemo_site_2)

    webdemo_site_2.admins.add(auth_user_1)

    # Processing model: Page

    from django_cradmin.demo.webdemo.models import Page

    webdemo_page_1 = Page()
    webdemo_page_1.site = webdemo_site_1
    webdemo_page_1.title = 'Dolor Nibh Dapibus'
    webdemo_page_1.intro = 'This is a test:)'
    webdemo_page_1.image = None
    webdemo_page_1.attachment = ''
    webdemo_page_1.body = 'Azz'
    webdemo_page_1.publishing_time = dateutil.parser.parse("2015-11-26T01:01:00+00:00")
    webdemo_page_1.unpublish_time = None
    webdemo_page_1.internal_notes = ''
    webdemo_page_1 = importer.save_or_locate(webdemo_page_1)

    webdemo_page_1.subscribers.add(auth_user_1)

    webdemo_page_2 = Page()
    webdemo_page_2.site = webdemo_site_1
    webdemo_page_2.title = 'My supertest!'
    webdemo_page_2.intro = 'Hello cruel world'
    webdemo_page_2.attachment = ''
    webdemo_page_2.body = 'Testing'
    webdemo_page_2.publishing_time = dateutil.parser.parse("2015-09-18T11:54:00+00:00")
    webdemo_page_2.unpublish_time = None
    webdemo_page_2.internal_notes = ''
    webdemo_page_2 = importer.save_or_locate(webdemo_page_2)

    webdemo_page_2.subscribers.add(auth_user_3)

    webdemo_page_3 = Page()
    webdemo_page_3.site = webdemo_site_1
    webdemo_page_3.title = 'One more test'
    webdemo_page_3.intro = 'Stuff assa'
    webdemo_page_3.image = None
    webdemo_page_3.attachment = ''
    webdemo_page_3.body = 'test'
    webdemo_page_3.publishing_time = dateutil.parser.parse("2015-12-12T01:01:00+00:00")
    webdemo_page_3.unpublish_time = None
    webdemo_page_3.internal_notes = ''
    webdemo_page_3 = importer.save_or_locate(webdemo_page_3)

    webdemo_page_3.subscribers.add(auth_user_1)
    webdemo_page_3.subscribers.add(auth_user_2)

    webdemo_page_4 = Page()
    webdemo_page_4.site = webdemo_site_1
    webdemo_page_4.title = 'Without image test'
    webdemo_page_4.intro = 'Yo'
    webdemo_page_4.image = None
    webdemo_page_4.attachment = ''
    webdemo_page_4.body = 'Man'
    webdemo_page_4.publishing_time = dateutil.parser.parse("2015-12-05T01:01:00+00:00")
    webdemo_page_4.unpublish_time = None
    webdemo_page_4.internal_notes = ''
    webdemo_page_4 = importer.save_or_locate(webdemo_page_4)

    # Processing model: PageTag

    from django_cradmin.demo.webdemo.models import PageTag

    webdemo_pagetag_1 = PageTag()
    webdemo_pagetag_1.page = webdemo_page_1
    webdemo_pagetag_1.tag = 'test'
    webdemo_pagetag_1 = importer.save_or_locate(webdemo_pagetag_1)

    webdemo_pagetag_2 = PageTag()
    webdemo_pagetag_2.page = webdemo_page_1
    webdemo_pagetag_2.tag = 'lorem'
    webdemo_pagetag_2 = importer.save_or_locate(webdemo_pagetag_2)

    webdemo_pagetag_3 = PageTag()
    webdemo_pagetag_3.page = webdemo_page_2
    webdemo_pagetag_3.tag = 'test'
    webdemo_pagetag_3 = importer.save_or_locate(webdemo_pagetag_3)

    webdemo_pagetag_4 = PageTag()
    webdemo_pagetag_4.page = webdemo_page_3
    webdemo_pagetag_4.tag = 'more'
    webdemo_pagetag_4 = importer.save_or_locate(webdemo_pagetag_4)

    # Processing model: Site

    from django_cradmin.demo.listfilterdemo.models import Site

    listfilterdemo_site_1 = Site()
    listfilterdemo_site_1.name = 'Demosite'
    listfilterdemo_site_1 = importer.save_or_locate(listfilterdemo_site_1)

    listfilterdemo_site_1.admins.add(auth_user_1)
    listfilterdemo_site_1.admins.add(auth_user_2)

    # Processing model: Person

    from django_cradmin.demo.listfilterdemo.models import Person

    listfilterdemo_person_1 = Person()
    listfilterdemo_person_1.site = listfilterdemo_site_1
    listfilterdemo_person_1.name = 'Jon Doe'
    listfilterdemo_person_1.banned_datetime = None
    listfilterdemo_person_1 = importer.save_or_locate(listfilterdemo_person_1)

    listfilterdemo_person_2 = Person()
    listfilterdemo_person_2.site = listfilterdemo_site_1
    listfilterdemo_person_2.name = 'Jane Doe'
    listfilterdemo_person_2.banned_datetime = None
    listfilterdemo_person_2 = importer.save_or_locate(listfilterdemo_person_2)

    listfilterdemo_person_3 = Person()
    listfilterdemo_person_3.site = listfilterdemo_site_1
    listfilterdemo_person_3.name = 'Angry Man'
    listfilterdemo_person_3.banned_datetime = dateutil.parser.parse("2015-12-07T04:29:00+00:00")
    listfilterdemo_person_3 = importer.save_or_locate(listfilterdemo_person_3)

    # Re-processing model: User




    # Re-processing model: Site



    # Re-processing model: Page





    # Re-processing model: PageTag

    # Re-processing model: Site



