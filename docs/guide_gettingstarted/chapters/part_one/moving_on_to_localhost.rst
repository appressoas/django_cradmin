.. _moving_on_to_localhost:

Moving on to Localhost
======================
We have tested the functioanlity we have created so far, and everything seems to be working as wanted. The time
has come to see our result on localhost. If you haven't done it yet, please add the models to your ``admin.py`` file.
Fire up localhost and go to Djangoadmin and create an Account and an AccountAdministrator. If you have the same url
patterns as suggested in this tutorial, you should see the template at `localhost/gettingstarted`. Another thing worth
checking out is to add a second Account in Djangoadmin for the AccountAdministrator. If you then go back to
`localhost/gettingstarted` you should see a view where you can choose which account you want to edit. This view is
automaticly added by CRadmin.

Next Chapter
------------
Continue to :ref:`login_functionality_in_cradmin`