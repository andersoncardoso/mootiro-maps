from django_assets import Bundle

markitup_js = Bundle(
    # 'markitup/ajax_csrf.js',
    'markitup/jquery.markitup.js',
    'markitup/sets/markdown_pt_BR/set.js',
    'js/widgets/markitup.js',
)

markitup_css = Bundle(
    'markitup/skins/simple/style.css',
    'markitup/sets/markdown_pt_BR/style.css',
)


tags_js = Bundle(
    'lib/tagsinput/jquery.tagsinput.js',
    'js/widgets/tags.js',
)

tags_css = Bundle(
    'lib/tagsinput/jquery.tagsinput.css',
)

common_form_js = Bundle(
    'lib/reForm.js',
    'js/templates/_common.js',
    markitup_js,
    'js/widgets/contact.js',
    tags_js,
    'js/common/forms.js',
)

common_form_css = Bundle(
    markitup_css,
    tags_css,
)
