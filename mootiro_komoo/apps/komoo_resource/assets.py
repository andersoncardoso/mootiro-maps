from django_assets import Bundle, register
from main.assets import markitup_js, markitup_css

resource_form_js = Bundle(
    'lib/reForm.js',
    'js/templates/_common.js',
    markitup_js,
    'js/resources/models.js',
    'js/resources/forms.js',
    filters='jsmin',
    output='gen/resource_form.js'
)

resource_form_css = Bundle(
    markitup_css,
    filters='cssmin',
    output='gen/resource_form.css'
)

register('resource_form_js', resource_form_js)
register('resource_form_css', resource_form_css)

