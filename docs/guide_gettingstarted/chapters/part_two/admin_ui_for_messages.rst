Admin UI for Messages
=====================
In this chapter we are going to add functionality needed to create a message without going to the Django admin. There
are several ways we can approach this, for instance we can create one or several views for messages within our exisiting
account admin UI CRadmin application, rename the public UI application to message UI application with both public and
admin views inside or we can create a new new CRadmin application with it's own CRadmin instance. Offcourse are there
pros and cons to all solutions. Further there is solutions not mentioned here. However, since a message has a foreign
key to an account, there is a logical point allowing the CRadmin instance of the account admin Cradmin application being
in charge of handling message creation, editing and deletion.

Create our own Base template for menu
-------------------------------------