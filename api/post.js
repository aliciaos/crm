var models = require('../models');
var Sequelize = require('sequelize');

var moment = require('moment');

//-----------------------------------------------------------


// Autoload el post asociado a :postId
exports.load = function (req, res, next, postId) {

    models.Post.findById(postId, {
        attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
        include: [
            {
                model: models.Attachment,
                attributes: ['id', 'url', 'mime', 'filename'],
                through: {attributes: []}
            },
            {
                model: models.Comment,
                attributes: {exclude: ['createdAt', 'deletedAt']}
            }
        ]
    })
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

//-----------------------------------------------------------

// GET /posts
exports.index = function (req, res, next) {

    var options = {};

    // Busquedas en el titulo o body de los poss:
    var searchContent = req.query.content || '';
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

    options.limit = 25;
    
     options.order = [['updatedAt', 'DESC']];
    options.attributes = {exclude: ['createdAt', 'deletedAt']};
    options.include = [
        {
            model: models.User,
            as: 'Author',
            attributes: []
        },
        {
            model: models.Attachment,
            attributes: ['id', 'url', 'mime', 'filename'],
            through: {attributes: []}
        },
        {
            model: models.Comment,
            attributes: {exclude: ['createdAt', 'deletedAt']}
        }
    ];

    models.Post.findAll(options)
    .then(function (posts) {
        res.json(posts);
    })
    .catch(function (error) {
        next(error);
    });
};

//-----------------------------------------------------------

// GET /posts/:postId
exports.show = function (req, res, next) {
    res.json(req.post);
};
//-----------------------------------------------------------
