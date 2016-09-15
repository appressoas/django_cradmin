import json

import os
from setuptools import setup, find_packages

with open(os.path.join(os.path.dirname(__file__), 'django_cradmin', 'version.json')) as f:
    version = json.loads(f.read())


setup(
    name='django_cradmin',
    description='A role based admin UI for Django that produces a user friendly and beautiful UI.',
    version=version,
    url='https://github.com/appressoas/django_cradmin',
    author='Espen Angell Kristiansen, Tor Johansen, Vegard Angell, Magne Westlie',
    author_email='post@appresso.no',
    license='BSD',
    packages=find_packages(
        exclude=[
            'ez_setup',
            'tasks'
        ]),
    zip_safe=False,
    include_package_data=True,
    install_requires=[
        'setuptools',
        'django-crispy-forms>=1.6.0',
        'Django>=1.8',
        'django-multiupload',
        'Jinja2',
        'pytz',
        'future',
        'html2text',
        'htmls',
    ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved',
        'Operating System :: OS Independent',
        'Programming Language :: Python'
    ]
)
