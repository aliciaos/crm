var urlm = require('url');


function addPagenoToUrl(url, pageno, _param_name) {
    var param_name = _param_name ? _param_name : "pageno";
    var urlObj = urlm.parse(url, true);

    urlObj.query[param_name] = pageno;

    delete urlObj.search;

    return urlm.format(urlObj);
}


// Helper function used to paginate.
// Return the HTML links used to paginate.
// 
exports.paginate = function (totalItems, itemsPerPage, currentPage, url, param_name) {

    if (totalItems <= itemsPerPage) {
        return false;
    }

    var total = Math.ceil(totalItems / itemsPerPage);

    // Number of links to show before and after the current page.
    // In addition to these, the first, last and intermediate links are also shown
    var neighbours = 2; // items a mostrar alrededor el la pagina actuañ

    var html = [];

    html.push('<nav aria-label="Page navigation example">');
    html.push('<ul class="pagination">');

    // Modify neighbors to avoid having few buttons:
    //  - If there is no space for the neighbors on the left, I show more by the right.
    //  - If there is no space for the neighbors on the right, I show more by the left.
    if (currentPage - neighbours <= 2) {
        neighbours += 3 + neighbours - currentPage;
    } else if (total - currentPage - neighbours <= 1) {
        neighbours += 2 - total + currentPage + neighbours;
    }

    // First page
    if (1 < currentPage - neighbours) {
        url = addPagenoToUrl(url, 1, param_name);
        html.push('<li class="page-item"> <a class="page-link" href="' + url + '">' + 1 + '</a></li>');
    }

    // Previous pages: between the first page and the middle pages
    if (currentPage - neighbours > 2) {
        var n = Math.trunc(( 1 + currentPage - neighbours) / 2);
        url = addPagenoToUrl(url, n, param_name);
        html.push('<li class="page-item"> <a class="page-link" href="' + url + '">' + n + '</a></li>');
    }

    // Pages in the middle
    for (var i = 1; i <= total; i++) {
        if (i === currentPage) {
            html.push('<li class="page-item active"> <a class="page-link" href="#">' + i + '</a></li>');
        } else {
            if (i >= currentPage - neighbours && i <= currentPage + neighbours) {
                url = addPagenoToUrl(url, i, param_name);
                html.push('<li class="page-item"> <a class="page-link" href="' + url + '">' + i + '</a></li>');
            }
        }
    }

    // Next pages: between the middle pages and the last page
    if (currentPage + neighbours < total - 1) {
        var n = Math.trunc(( total + currentPage + neighbours + 1) / 2);
        url = addPagenoToUrl(url, n, param_name);
        html.push('<li class="page-item"> <a class="page-link" href="' + url + '">' + n + '</a></li>');
    }

    // Last page
    if (total > currentPage + neighbours) {
        url = addPagenoToUrl(url, total, param_name);
        html.push('<li class="page-item"> <a class="page-link" href="' + url + '">' + total + '</a></li>');
    }

    html.push('</ul>');
    html.push('</nav>');

    return html.join('');
};