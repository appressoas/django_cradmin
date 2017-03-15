.. _setting_up_dashboards:

=====================
Dashboards for Crapps
=====================

We will create dashboards for artist, album and song which will be used when we add new object instances and for linking
to the lists we will create. This work is pretty much the same as we did when we created CRadmin instances and Cradmin
applications in the Getting Started Tutorial. Beside the three crapps, one for each dashboard, will we create two
CRadmin instances, one named *main_crinstance*  and one named *artist_crinstance*. We do this so we can have one
dashboard which don't require a role, where we list objects as in a public UI and have the opportunity to add new
artists. The * artist_crinstance* will use Artist as the role. Here we will add albums and songs.