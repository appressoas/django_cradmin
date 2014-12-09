from setuptools import setup, find_packages

setup(
    name='django_cradmin',
    description='Django cradmin.',
    version='1.0.0-beta.001',
    url='https://github.com/appressoas/django_cradmin',
    author='Espen Angell Kristiansen, Vegard Angell',
    license='BSD',
    packages=find_packages(
        exclude=[
            'ez_setup',
            'django_cradmin_testsettings',
            'django_cradmin_testurls'
        ]),
    zip_safe=False,
    include_package_data=True,
    install_requires=[
        'setuptools',
        'django-crispy-forms',
        'Django',
        'django-angular',
    ],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved',
        'Operating System :: OS Independent',
        'Programming Language :: Python'
    ]
)
