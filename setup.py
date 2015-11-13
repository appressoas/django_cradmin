from setuptools import setup, find_packages

setup(
    name='django_cradmin',
    description='A role based admin UI for Django that produces a user friendly and beautiful UI.',
    version='1.0.0b24',
    url='https://github.com/appressoas/django_cradmin',
    author='Espen Angell Kristiansen, Tor Johansen, Vegard Angell, Magne Westlie',
    author_email='post@appresso.no',
    license='BSD',
    packages=find_packages(
        exclude=[
            'ez_setup',
            'django_cradmin_testsettings',
            'django_cradmin_testurls',
            'fabfile'
        ]),
    zip_safe=False,
    include_package_data=True,
    install_requires=[
        'setuptools',
        'django-crispy-forms',
        'Django',
        'django-multiupload',
        'Jinja2',
        'pytz',
        'future'
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
