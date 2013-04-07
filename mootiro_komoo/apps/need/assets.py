from django_assets import Bundle, register
from main.assets import common_form_js, common_form_css


need_form_js = Bundle(
    common_form_js,
    'js/needs/models.js',
    'js/needs/forms.js',
    filters='jsmin',
    output='gen/need_form.js'
)

need_form_css = Bundle(
    common_form_css,
    filters='cssmin',
    output='gen/need_form.css'
)

register('need_form_js', need_form_js)
register('need_form_css', need_form_css)

