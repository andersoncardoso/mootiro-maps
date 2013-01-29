This folder is intended to serve as a basis for one creating a new app. It
gathers all boilerplate code just to be copied into the right places.

Below are the steps needed to do it.

STEPS:

1. cp apps_myapp apps/myapp
2. cp static_js_myapp static/js/myapp
3. cp static_templates_myapp static/templates/myapp
4. Add your app name to INSTALLED_APPS in settings/common.py
5. Add your app urls entry point to urlpatterns in /urls.py
6. Add 'myapp/router' on initializeRouters in core/app.coffee
7. Run server and point your browser to localhost:8001/myapp
8. Do not forget to change 'myapp' to an appropriate name for your app
