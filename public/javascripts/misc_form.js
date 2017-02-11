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
}

