var models = require('../models');
var Sequelize = require('sequelize');

var paginate = require('./paginate').paginate;

exports.load = function (req, res, next, postId) {

    models.Post.findById(
        postId,
        {
            include: [
                {
                    model: models.User,
                    as: 'Author',
                    include: {
                        model: models.Salesman,
                        as: "Salesman",
                        include: [{model: models.Attachment, as: 'Photo'}]
                    }
                },
                {
                    model: models.Comment,
                    order: [['updatedAt', 'DESC']],
                    include: [{model: models.User, as: 'Author'}]
                }
            ]
        }
    )
    .then(function (post) {
        if (post) {
            req.post = post;
            next();
        } else {
            throw new Error('No existe ningún post con Id=' + postId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


/*
 * Comprueba que el usuario logeado es el author.
 */
exports.loggedUserIsAuthor = function (req, res, next) {

    if (req.session.user && req.session.user.id == req.post.AuthorId) {
        next();
    } else {
        console.log('Operación prohibida: El usuario logeado no es el autor del post.');
        res.send(403);
    }
};


// GET /posts
exports.index = function (req, res, next) {

    var options = {};

    // Busquedas en el titulo o body de los poss:
    var searchContent = req.query.searchContent || '';
    if (searchContent) {
        var search_like = "%" + searchContent.replace(/ +/g, "%") + "%";

        var likeCondition;
        if (!!process.env.DATABASE_URL && /^postgres:/.test(process.env.DATABASE_URL)) {
            // el operador $iLike solo funciona en pastgres
            likeCondition = {$iLike: search_like};
        } else {
            likeCondition = {$like: search_like};
        }

        options.where = {
            $or: [
                {title: likeCondition},
                {body: likeCondition}
            ]
        };
    }

    models.Post.count(options)
    .then(function (count) {

        // Paginacion:

        var items_per_page = 25;

        // La pagina a mostrar viene en la query
        var pageno = parseInt(req.query.pageno) || 1;

        // Crear un string con el HTML que pinta la botonera de paginacion.
        // Lo añado como una variable local de res para que lo pinte el layout de la aplicacion.
        res.locals.paginate_control = paginate(count, items_per_page, pageno, req.url);


        options.offset = items_per_page * (pageno - 1);
        options.limit = items_per_page;
        options.order = [['updatedAt', 'DESC']];
        options.include = [
            {
                model: models.User,
                as: 'Author',
                include: {
                    model: models.Salesman,
                    as: "Salesman",
                    include: [{model: models.Attachment, as: 'Photo'}]
                }
            }
        ];

        return models.Post.findAll(options);
    })
    .then(function (posts) {
        res.render('posts/index', {
            posts: posts,
            searchContent: searchContent
        });
    })
    .catch(function (error) {
        next(error);
    });
};


// GET /posts/:postId
exports.show = function (req, res, next) {

    res.render('posts/show', {
        post: req.post
    });
};


// GET /posts/new
exports.new = function (req, res, next) {

    var post = models.Post.build({
        title: '',
        body: ''
    });

    res.render('posts/new', {post: post});
};

// POST /posts
exports.create = function (req, res, next) {

    var post = {
        title: req.body.title.trim(),
        body: req.body.body.trim(),
        AuthorId: req.session.user.id
    };

    models.Post.create(post)
    .then(function (post) {
        req.flash('success', 'Post creado con éxito.');
        res.redirect('/reload');

    })
    .catch(Sequelize.ValidationError, function (error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

        res.render('posts/new', {
            post: post
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al crear un post: ' + error.message);
        next(error);
    });
};


// GET /posts/:postId/edit
exports.edit = function (req, res, next) {
    res.render('posts/edit', {
        post: req.post
    });
};


// PUT /posts/:postId
exports.update = function (req, res, next) {

    req.post.title = req.body.title;
    req.post.body = req.body.body;


    req.post.save(['title', 'body'])
    .then(function (post) {
        req.flash('success', 'Post actualizado con éxito.');
        res.redirect('/reload');
    })
    .catch(Sequelize.ValidationError, function (error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

        res.render('post/edit', {
            post: req.post
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al editar un post: ' + error.message);
        next(error);
    });
};


// DELETE /posts/:postId
exports.destroy = function (req, res, next) {

    // Borrar el post:
    req.post.destroy()
    .then(function () {
        req.flash('success', 'POst borrado con éxito.');
        res.redirect("/goback");
    })
    .catch(function (error) {
        req.flash('error', 'Error al borrar un post: ' + error.message);
        next(error);
    });
};



















