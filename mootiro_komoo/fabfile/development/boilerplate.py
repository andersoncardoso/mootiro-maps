# -*- coding:utf-8 -*-
import os

from fabric.api import *


def startapp(appname):
    here = os.path.dirname(os.path.abspath(__file__))
    myapp_dir = os.path.join(here, 'myapp')
    local('mkdir apps/{}'.format(appname))
    local('cp {}/apps_myapp apps/{}'.format(myapp_dir, appname))
    local('mkdir static/js/{}'.format(appname))
    local('cp {}/static_js_myapp static/js/{}'.format(myapp_dir, appname))
    local('mkdir static/templates/{}'.format(appname))
    local('cp {}/static_templates_myapp static/templates/{}'.format(myapp_dir, appname))

    print '''
ATTENTION! Now it's your part, do the following:
  1. Add your app name to INSTALLED_APPS in settings/common.py
  2. Add your app urls entry point to urlpatterns in ./urls.py
  3. Add your app router to initializeRouters in core/app.coffee
'''
