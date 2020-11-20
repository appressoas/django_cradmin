Django-cradmin 8 releasenotes
=============================


8.0.0
=====

## What is new

- Requires Django 3.x
- Requires ievv-opensource 7.x+
- Requires python 3.8+


## Migrating to django-cradmin 8.0

### Migrating from 6.x
If you are migrating from django-cradmin 6.x, you should just need to:

- Update your own application for Django 3.
- Update django-cradmin to 8.0.x


### Migrating from 7.x
Version 7.x of django-cradmin was an experimental Django2 release. There is many changes
in 6.x and 8.x that is not in 7.x. You SHOULD be able to just update to django-cradmin 8.0.x,
but you may have some issues. If you do, check out the releasenotes for 6.x.


## 8.0 patch releases

### 8.0.1
- Remove pyproject.toml. It causes an issue with strict PEP 517 checking in pip.
- Update to ievv-opensource>=7.0.3 with the same pyproject.toml fix.

### 8.0.2
- Update forgotten url(...) in crapp.py for django3.

### 8.0.3
- Update logout.py - Fix wrong handling of view decorator for logout view
