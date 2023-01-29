var express = require('express');
var router = express.Router();
var noveltiesModel = require('../../models/noveltiesModel');

router.get('/', async function (req,res,next) {

    var novelties = await noveltiesModel.getNovelties();

    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario: req.session.user_name,
        novelties
    });
});

router.get('/agregar', (req,res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    });
});

router.post('/agregar', async (req, res, next) => {
    try {
        if (req.body.title != "" && req.body.subtitle != "" && req.body.bodies != "") {
            await noveltiesModel.insertNovelty(req.body);
            res.redirect('/admin/novedades');
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'todos los campos son requeridos'
            })
        }
    } catch (error) {
        console.log(error)
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        }); 
    };
});

router.get('/eliminar/:id', async (req, res, next) => {
    // aca creo que va novelties_id, no es necesario con id solo esta bien
    var id = req.params.id;

    await noveltiesModel.deleteNoveltiesById(id);
    res.redirect('/admin/novedades');
})

router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    console.log(req.params.id);
    var novelty = await noveltiesModel.getNoveltyById(id);

    console.log(req.params.id)
    res.render('admin/modificar', {
        layout: 'admin/layout',
        novelty
    })
})

router.post('/modificar', async (req, res, next) => {
    try {
        var obj = {
            novelties_title: req.body.novelties_title,
            novelties_subtitle: req.body.novelties_subtitle,
            novelties_bodie: req.body.novelties_bodie
        }
        console.log(obj);
        console.log(req.body.novelties_id);

        await noveltiesModel.updateNoveltyById(obj, req.body.novelties_id);
        res.redirect('/admin/novedades');
        clear
    } catch (error) {
        console.log(error);
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se modifico la novedad'
        })
    }
})

module.exports = router;