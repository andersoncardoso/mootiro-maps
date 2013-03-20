
formTemplate = """
<form action="" method="post" id="<%= formId %>" >
    <div class="form-actions">
        <input class="btn button" type="submit" name="submit" value="<%=submit_label%>" />
    </div>
</form>
"""

KomooNS ?= {}
KomooNS.templates ?= {}
KomooNS.templates.formTemplate = formTemplate
