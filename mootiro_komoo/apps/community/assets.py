from django_assets import Bundle, register
from main.assets import common_form_js, common_form_css


community_form_js = Bundle(
    common_form_js,
    'js/communities/models.js',
    'js/communities/forms.js',
    filters='jsmin',
    output='gen/community_form.js'
)

community_form_css = Bundle(
    common_form_css,
    filters='cssmin',
    output='gen/community_form.css'
)

register('community_form_js', community_form_js)
register('community_form_css', community_form_css)

