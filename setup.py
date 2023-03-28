import json

import os
from setuptools import setup, find_packages

with open(os.path.join(os.path.dirname(__file__), 'django_cradmin', 'version.json')) as f:
    version = json.loads(f.read())


setup(
    name='django-cradmin',
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
        'Django>=4.0.0,<5.0.0',
        'html2text',
        'ievv_opensource>=9.0.0,<10.0.0'
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
