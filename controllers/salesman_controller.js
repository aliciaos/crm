var models = require('../models');
var Sequelize = require('sequelize');
var cloudinary = require('cloudinary');
var fs = require('fs');

var moment = require('moment');

//-----------------------------------------------------------

// Opciones para imagenes subidas a Cloudinary
var cloudinary_image_options = {
    async: true,
    folder: "/crm/" + (process.env.CLOUDINARY_SUBFOLDER || "iweb") + "/salesmen",
    crop: 'limit',
    width: 200,
    height: 200,
    radius: 5,
    border: "3px_solid_blue",
    tags: ['core', 'decoversia', 'crm']
};


//-----------------------------------------------------------


// Autoload el vendedor asociado a :salesmanId
exports.load = function (req, res, next, salesmanId) {

    models.Salesman.findById(salesmanId,
        {
            include: [
                models.User,
                {model: models.Attachment, as: 'Photo'}
            ],
            order: [['name']]
        }
    )
    .then(function (salesman) {
        if (salesman) {
            req.salesman = salesman;
            next();
        } else {
            throw new Error('No existe ningún vendedor con Id=' + salesmanId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------

// GET /salesmen
exports.index = function (req, res, next) {

    var options = {};
    options.where = {};
    options.order = [['name']];
    options.include = [
        models.User,
        {model: models.Attachment, as: 'Photo'}
    ];

    models.Salesman.findAll(options)
    .then(function (salesmen) {
        res.render('salesmen/index.ejs', {salesmen: salesmen});
    })
    .catch(function (error) {
        next(error);
    });
};


// GET /salesmen/:salesmanId
exports.show = function (req, res, next) {

    res.render('salesmen/show', {salesman: req.salesman});
};


//-------------------------------------


// Auxiliar
// Devuelve una promesa que al cumplirse devuelve un array con el username de todos los
// usuarios (User)) y que se usa para construir un formulario de seleccion.
function infoOfUsers() {

    return models.User.findAll({order: [['username']]})
    .then(function (users) {
        return users.map(function (user) {
            return {
                id: user.id,
                name: user.username
            };
        });
    });
}

// GET /salesmen/new
exports.new = function (req, res, next) {

    var salesman = models.Salesman.build({
        name: "",
        UserId: 0
    });

    infoOfUsers()
    .then(function (users) {

        res.render('salesmen/new', {
            salesman: salesman,
            users: users
        });

    })
    .catch(function (error) {
        req.flash('error', 'Error al crear un vendedor: ' + error.message);
        next(error);
    });
};


// POST /salesmen/create
exports.create = function (req, res, next) {

    var salesman = {
        name: req.body.name.trim(),
        UserId: Number(req.body.userId) || 0
    };

    // Guarda en la tabla Salesmen el nuevo vendedor.
    models.Salesman.create(salesman)
    .then(function (salesman) {
        req.flash('success', 'Vendedor creado con éxito.');

        if (!req.file) {
            req.flash('info', 'Es un Vendedor sin fotografía.');
            return salesman;
        }

        // Salvar la imagen en Cloudinary
        return uploadResourceToCloudinary(req)
        .then(function (uploadResult) {
            // Crear nuevo attachment en la BBDD.
            return createAttachment(req, uploadResult, salesman);
        })
        .then(function () {
            return salesman;
        });
    })
    .then(function (salesman) {
        res.redirect("/salesmen/" + salesman.id);
    })
    .catch(Sequelize.ValidationError, function (error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

        return infoOfUsers()
        .then(function (users) {
            res.render('salesmen/new', {
                salesman: salesman,
                users: users
            });
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al crear un vendedor: ' + error.message);
        next(error);
    });
};


// GET /salesmen/:salesmanId/edit
exports.edit = function (req, res, next) {

    var salesman = req.salesman;  // autoload

    infoOfUsers()
    .then(function (users) {
        res.render('salesmen/edit', {
            salesman: salesman,
            users: users
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al editar un vendedor: ' + error.message);
        next(error);
    });
};


// PUT /salesmen/:salesmanId
exports.update = function (req, res, next) {

    req.salesman.name = req.body.name.trim();


    new Promise(function (resolve, reject) {

        var userId = Number(req.body.userId) || 0;

        if (userId) {
            models.User.findById(userId)
            .then(function (user) {
                //resolve(req.salesman.setUser(user));
                resolve(user.setSalesman(req.salesman));
            });
        } else {
            req.salesman.UserId =  0;
            resolve();
        }
    })
    .then(function () {

        return req.salesman.save({fields: ["name", "UserId"]})
    })
    .then(function (salesman) {

        req.flash('success', 'Vendedor editado con éxito.');

        if (!req.body.keepphoto) {
            // Sin imagen: Eliminar attachment e imagen viejos.
            if (!req.file) {
                req.flash('info', 'Tenemos un vendedor sin fotografía.');
                if (salesman.Photo) {
                    cloudinary.api.delete_resources(salesman.Photo.public_id);
                    salesman.Photo.destroy();
                }
                return salesman;
            }

            // Salvar la foto nueva en Cloudinary
            return uploadResourceToCloudinary(req)
            .then(function (uploadResult) {
                // Actualizar el attachment en la BBDD.
                return updateAttachment(req, uploadResult, salesman);
            })
            .then(function () {
                return salesman;
            });
        } else {
            return salesman;
        }
    })
    .then(function (salesman) {

        res.redirect("/salesmen/" + salesman.id);
    })
    .catch(Sequelize.ValidationError, function (error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }


        return infoOfUsers()
        .then(function (users) {
            res.render('salesmen/edit', {
                salesman: req.salesman,
                users: users
            });
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al editar un vendedor: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------


// DELETE /salesmen/:salesmanId
exports.destroy = function (req, res, next) {

    // Borrar el vendedor:
    req.salesman.destroy()
    .then(function () {
        req.flash('success', 'Vendedor borrado con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al borrar un vendedor: ' + error.message);
        next(error);
    });
};


//------------------------------------------------

// FUNCIONES AUXILIARES - Cloudinary

/**
 * Crea una promesa para crear un attachment en la tabla Attachments.
 */
function createAttachment(req, uploadResult, salesman) {
    if (!uploadResult) {
        return Promise.resolve();
    }

    return models.Attachment.create({
        public_id: uploadResult.public_id,
        url: uploadResult.url,
        filename: req.file.originalname,
        mime: req.file.mimetype
    })
    .then(function (attachment) {
        return salesman.setPhoto(attachment);
    })
    .then(function () {
        req.flash('success', 'Fotografía guardada con éxito.');
    })
    .catch(function (error) { // Ignoro errores de validacion en imagenes
        req.flash('error', 'No se ha podido salvar la fotografía: ' + error.message);
        cloudinary.api.delete_resources(uploadResult.public_id);
    });
}


/**
 * Crea una promesa para actualizar un attachment en la tabla Attachments.
 */
function updateAttachment(req, uploadResult, salesman) {
    if (!uploadResult) {
        return Promise.resolve();
    }

    // Recordar public_id de la foto antigua.
    var old_public_id = salesman.Photo ? salesman.Photo.public_id : null;

    return salesman.getPhoto()
    .then(function (attachment) {
        if (!attachment) {
            attachment = models.Attachment.build({});
        }
        attachment.public_id = uploadResult.public_id;
        attachment.url = uploadResult.url;
        attachment.filename = req.file.originalname;
        attachment.mime = req.file.mimetype;
        return attachment.save();
    })
    .then(function (attachment) {
        return salesman.setPhoto(attachment);
    })
    .then(function (attachment) {
        req.flash('success', 'Imagen nueva guardada con éxito.');
        if (old_public_id) {
            cloudinary.api.delete_resources(old_public_id);
        }
    })
    .catch(function (error) { // Ignoro errores de validacion en imagenes
        req.flash('error', 'No se ha podido salvar la nueva imagen: ' + error.message);
        cloudinary.api.delete_resources(uploadResult.public_id);
    });
}


/**
 * Crea una promesa para subir una imagen nueva a Cloudinary.
 * Tambien borra la imagen original.
 *
 * Si puede subir la imagen la promesa se satisface y devuelve el public_id y
 * la url del recurso subido.
 * Si no puede subir la imagen, la promesa tambien se cumple pero devuelve null.
 *
 * @return Devuelve una Promesa.
 */
function uploadResourceToCloudinary(req) {
    return new Promise(function (resolve, reject) {
        var path = req.file.path;
        cloudinary.uploader.upload(
            path,
            function (result) {
                fs.unlink(path); // borrar la imagen subida a ./uploads
                if (!result.error) {
                    resolve({public_id: result.public_id, url: result.secure_url});
                } else {
                    req.flash('error', 'No se ha podido salvar la fotografía: ' + result.error.message);
                    resolve(null);
                }
            },
            cloudinary_image_options
        );
    })
}


//------------------------------------------------


