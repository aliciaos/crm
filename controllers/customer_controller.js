
var models = require('../models');
var Sequelize = require('sequelize');
var fs = require('fs');
const readline = require('readline');

var paginate = require('./paginate').paginate;

//-----------------------------------------------------------


// Autoload el cliente asociado a :customerId
exports.load = function(req, res, next, customerId) {

    models.Customer.findById(customerId, 
                          { order: [[ 'name' ]]
                          })
    .then(function(customer) {
        if (customer) {
            req.customer = customer;
            next();
        } else { 
            throw new Error('No existe ningún cliente con Id=' + customerId);
        }
    })
    .catch(function(error) { next(error); });
};


//-----------------------------------------------------------

// GET /customers
exports.index = function(req, res, next) {

    var options = {};

    models.Customer.count(options)
    .then(function(count) {

        // Paginacion:
        var items_per_page = 25;

        // La pagina a mostrar viene en la query
        var pageno = parseInt(req.query.pageno) || 1;

        // Datos para obtener el rango de datos a buscar en la BBDD.
        var pagination = {
            offset: items_per_page * (pageno - 1),
            limit: items_per_page
        };

        // Crear un string con el HTML que pinta la botonera de paginacion.
        // Lo añado como una variable local de res para que lo pinte el layout de la aplicacion.
        res.locals.paginate_control = paginate(count, items_per_page, pageno, req.url);

        return pagination;
    })
    .then(function(pagination) {

        options.offset = pagination.offset;
        options.limit = pagination.limit;

        options.order = [['name']];

        return models.Customer.findAll(options);
    })
    .then(function(customers) {
        res.render('customers/index.ejs', {customers: customers});
    })
    .catch(function(error) {
        next(error);
    });
};



// GET /customers/:customerId
exports.show = function(req, res, next) {

    res.render('customers/show', {customer: req.customer});
};


// GET /customers/new
exports.new = function(req, res, next) {

    var customer = models.Customer.build({ 
        code: "",
        name: "",
        cif: "", 
        address1: "", 
        address2: "", 
        postalCode: "", 
        city: "", 
        phone1: "", 
        phone2: "", 
        phone3: "", 
        phone4: "", 
        email1: "", 
        email2: "", 
        web: "",
        cif: "" });

    res.render('customers/new', { customer: customer });
};


// POST /customers/create
exports.create = function(req, res, next) {

    var customer = { 
        code: req.body.code.trim(),
        name: req.body.name.trim(),
        cif: req.body.cif.trim(), 
        address1: req.body.address1.trim(), 
        address2: req.body.address2.trim(), 
        postalCode: req.body.postalCode.trim(), 
        city: req.body.city.trim(), 
        phone1: req.body.phone1.trim(), 
        phone2: req.body.phone2.trim(), 
        phone3: req.body.phone3.trim(), 
        phone4: req.body.phone4.trim(), 
        email1: req.body.email1.trim(), 
        email2: req.body.email2.trim(), 
        web: req.body.web.trim(),
        cif: req.body.cif.trim() 
    };

    // Guarda en la tabla Customers el nueva cliente.
    models.Customer.create(customer)
    .then(function(customer) {
        req.flash('success', 'Cliente creado con éxito.');   

        res.redirect("/goback");
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        res.render('customers/new', { customer: customer });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear un cliente: ' + error.message);
        next(error);
    }); 
};




// GET /customers/:customerId/edit
exports.edit = function(req, res, next) {

    var customer = req.customer;  // autoload

    res.render('customers/edit', { customer: customer });
};



// PUT /customers/:customerId
exports.update = function(req, res, next) {

    req.customer.code       = req.body.code.trim();
    req.customer.name       = req.body.name.trim();
    req.customer.cif        = req.body.cif.trim();
    req.customer.address1   = req.body.address1.trim();
    req.customer.address2   = req.body.address2.trim();
    req.customer.postalCode = req.body.postalCode.trim();
    req.customer.city       = req.body.city.trim();
    req.customer.phone1     = req.body.phone1.trim();
    req.customer.phone2     = req.body.phone2.trim();
    req.customer.phone3     = req.body.phone3.trim();
    req.customer.phone4     = req.body.phone4.trim();
    req.customer.email1     = req.body.email1.trim();
    req.customer.email2     = req.body.email2.trim();
    req.customer.web        = req.body.web.trim();
    req.customer.cif        = req.body.cif.trim();

    req.customer.save()
    .then(function(customer) {

        req.flash('success', 'Cliente editado con éxito.'); 

        res.redirect("/goback");
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('customers/edit', { customer: req.customer });
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar un cliente: '+error.message);
      next(error);
    });
};


// DELETE /customers/:customerId
exports.destroy = function(req, res, next) {

    // Borrar el cliente:
    req.customer.destroy()
    .then(function() {
        req.flash('success', 'Cliente borrado con éxito.');
        res.redirect("/reload");
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar un cliente: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------


// GET /customers/importGet
exports.importForm = function(req, res, next) {

    res.render('customers/import');
};


// POST /customers/importPost
exports.importPost = function(req, res, next) {

    if (!req.file) {
        req.flash('error', 'No se han importado clientes porque falta el fichero CSV de clientes.');
        res.redirect("/reload");
        return;
    }


    if (req.file.mimetype !== "text/csv") {
        req.flash('error', 'El fichero de clientes ' + req.file.originalname + ' no es un CSV.');
        fs.unlinkSync(req.file.path);
        res.redirect("/reload");
        return;
    }

    var customers = [];

    var isHeadersLine = true;

    const rl = readline.createInterface({
        input: fs.createReadStream(req.file.path)
    });

    rl.on('line', function(line) {
        console.log('Line from file: ' + line);

        if (isHeadersLine) {
            isHeadersLine = false;
            return;
        }

        var fields = line.split(';');

        var customer = {
            code:       (fields[ 0] || "").trim(),
            name:       (fields[ 1] || "").trim(),
            cif:        (fields[ 2] || "").trim(),
            address1:   (fields[ 3] || "").trim(),
            address2:   (fields[ 4] || "").trim(),
            postalCode: (fields[ 5] || "").trim(),
            city:       (fields[ 6] || "").trim(),
            phone1:     (fields[ 7] || "").trim(),
            phone2:     (fields[ 8] || "").trim(),
            phone3:     (fields[ 9] || "").trim(),
            phone4:     (fields[10] || "").trim(),
            email1:     (fields[11] || "").trim(),
            email2:     (fields[12] || "").trim(),
            web:        (fields[13] || "").trim()
        };

        console.log(customer);

        customers.push(customer);
    });

    rl.on('close', function() {

        fs.unlinkSync(req.file.path);

        models.Customer.bulkCreate(customers, {
            hooks: false,
            validate: true,
            individualHooks: true
        }).then(function() {
            req.flash('success', 'El fichero de clientes ' + req.file.originalname + ' se ha cargado con éxito.');
            res.redirect('/reload');
        }).catch(function(errors) {
            console.log(errors);
            req.flash('error', 'Hay campos incorrectos en ' + req.file.originalname + '.');
            req.flash('error', 'No se ha importado ningún cliente');
            res.render('customers/import');
        });
    });

};
