from django_assets import Bundle, register
from main.assets import markitup_js, markitup_css
from main.assets import tags_js, tags_css


objects_form_js = Bundle(
    'lib/reForm.js',
    'js/templates/_common.js',
    markitup_js,
    'js/widgets/contact.js',
    tags_js,
    'js/common_objects/edit.js',
    filters='jsmin',
    output='gen/objects_form.js'
)

objects_form_css = Bundle(
    markitup_css,
    tags_css,
    filters='cssmin',
    output='gen/objects_form.css'
)

register('objects_form_js', objects_form_js)
register('objects_form_css', objects_form_css)
