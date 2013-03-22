
formTemplate = """
<form action="" method="post" id="<%= formId %>" >
    <div class="form-actions">
        <input class="btn button" type="submit" name="submit" value="<%=submit_label%>" />
    </div>
</form>
"""

window.KomooNS ?= {}
window.KomooNS.templates ?= {}
window.KomooNS.templates.formTemplate = formTemplate
