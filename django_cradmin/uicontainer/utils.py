import django


def has_template_based_form_rendering():
    return django.VERSION[0:3] >= (1, 11, 0)
