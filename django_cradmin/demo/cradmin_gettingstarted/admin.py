from django.contrib import admin

from django_cradmin.demo.cradmin_gettingstarted.models import Account, AccountAdministrator, Message


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]


@admin.register(AccountAdministrator)
class AccountAdministratorAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'account'
    ]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'body',
        'creation_time',
        'account',
        'number_of_likes'
    ]
