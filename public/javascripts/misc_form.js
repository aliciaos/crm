/**
 * Limpia los campos de un formulario.
 *
 * @param formId Id del formulario a limpiar.
 */
function cleanupForm(formId) {

    var form = document.getElementById(formId);

    var inputs = form.getElementsByTagName("input");
    for (var i=0 ; i < inputs.length ; i++) {
        inputs[i].value = "";
    }

    var selects = form.getElementsByTagName("select");
    for (var i=0 ; i < selects.length ; i++) {
        selects[i].value = "";
    }
}

