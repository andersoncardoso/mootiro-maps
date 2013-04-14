from django_assets import Bundle, register
from main.assets import common_form_js, common_form_css


organization_form_js = Bundle(
    common_form_js,
    'js/organizations/models.js',
    'js/organizations/forms.js',
    filters='jsmin',
    output='gen/organization_form.js'
)

organization_form_css = Bundle(
    common_form_css,
    filters='cssmin',
    output='gen/organization_form.css'
)

register('organization_form_js', organization_form_js)
register('organization_form_css', organization_form_css)

