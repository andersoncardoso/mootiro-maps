from django.contrib import admin
from organization.models import Organization, OrganizationBranch


class OrganizationBranchAdmin(admin.ModelAdmin):
    pass


class OrganizationAdmin(admin.ModelAdmin):
    pass

admin.site.register(OrganizationBranch, OrganizationBranchAdmin)
admin.site.register(Organization, OrganizationAdmin)
