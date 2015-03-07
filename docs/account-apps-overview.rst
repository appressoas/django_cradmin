#################################################
Account management apps introduction and overview
#################################################

We provide a set of decoupled apps for account management.
You can choose to use some or all of them. The only advantage
of using them all, is that they default to integrating with
each other, so if you use them as standalone apps and provide
your own alternatives for some of them, you will have to
add slightly more code and configuration.


********
Language
********
Our default templates lean towards minimalistic. We try to
provide a good starting point that you can use in a beta,
and in many cases in production.

If you want to add branding and language targeted more for
your product/app, you will have to override some templates
and methods, or perhaps create your own translation. This is
fairly straight forward, and documented for each of the apps.


"Sign in/Sign out" vs "Log in/Log out"
======================================
No matter what wording you choose for login/logout, the most imporant
thing is consistency. We have chosen *Sign in* and *Sign out*. If you
want to change this, you will probably want to create your own translation
files.

See http://ux.stackexchange.com/questions/1080/using-sign-in-vs-using-log-in
for a discussion on this subject.


"Sign up for SITENAME" vs "Register" vs "Join SITENAME"
=======================================================
We elected to go with *Sign up for SITENAME*. This is fairly general purpose
and as long as we always use *Sign up for SITENAME*, and never just *Sign up*,
it is fairly easy to distinguish from *Sign in*.
