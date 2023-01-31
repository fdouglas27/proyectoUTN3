var express = require('express');
var router = express.Router();
var noveltiesModel = require('../../models/noveltiesModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function (req, res, next) {

    var novelties = await noveltiesModel.getNovelties();

    novelties = novelties.map(novelty => {
        if (novelty.novelties_img_id) {
            const image = cloudinary.image(novelty.novelties_img_id, {
                width: 80,
                height: 80,
                crop: 'fill'
            });
            return {
                ...novelty,
                image
            }
        } else {
            return {
                ...novelty,
                image: ''
            }
        };
    });

    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario: req.session.user_name,
        novelties
    });
});

router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    });
});

router.post('/agregar', async (req, res, next) => {

    try {
        let novelties_img_id = '';
        if (req.files && Object.keys(req.files).length > 0) {
            image = req.files.imagen;
            novelties_img_id = (await uploader(image.tempFilePath)).public_id;
        };

        if (req.body.title != "" && req.body.subtitle != "" && req.body.bodies != "") {
            await noveltiesModel.insertNovelty({
                ...req.body,
                novelties_img_id
            });
            res.redirect('/admin/novedades');
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'todos los campos son requeridos'
            });
        };
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

    let novelty = await noveltiesModel.getNoveltyById(id);
    if (novelty.novelties_img_id) {
        await (destroy(novelty.novelties_img_id))
    };

    await noveltiesModel.deleteNoveltiesById(id);
    res.redirect('/admin/novedades');
});

router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    console.log(req.params.id);
    var novelty = await noveltiesModel.getNoveltyById(id);
    // var novelties = await noveltiesModel.getNovelties();

    // novelties = novelties.map(novelty_01 => {
    //     if (novelty_01.novelties_img_id === novelty.novelties_img_id) {
            // const image = cloudinary.image(novelty_01.novelties_img_id, {
            //     width: 80,
            //     height: 80,
            //     crop: 'fill'
            // });
            // return {
            //     ...novelty_01,
            //     image
            // }

    //     } else {
    //         return {
    //             ...novelty_01,
    //             image: ''
    //         }
    //     }
    // });

    console.log(req.params.id)
    res.render('admin/modificar', {
        layout: 'admin/layout',
        novelty
    });
});

router.post('/modificar', async (req, res, next) => {
    try {
        
        let novelties_img_id = req.body.img_original;
        let delete_img_old = false;

        if (req.body.img_delete === '1') {
            console.log(req.body.img_delete)
            novelties_img_id = null;
            delete_img_old = true;
        } else {
            if (req.files && Object.keys(req.files).length > 0) {
                image = req.files.imagen;
                novelties_img_id = (await uploader(image.tempFilePath)).public_id;
                delete_img_old = true;
            }
        };
        if (delete_img_old && req.body.img_original) {
            await (destroy(req.body.img_original));
        };

        var obj = {
            novelties_title: req.body.novelties_title,
            novelties_subtitle: req.body.novelties_subtitle,
            novelties_bodie: req.body.novelties_bodie,
            novelties_img_id
        };
        console.log(obj);
        console.log(req.body.novelties_id);

        await noveltiesModel.updateNoveltyById(obj, req.body.novelties_id);
        res.redirect('/admin/novedades');
    } catch (error) {
        console.log(error);
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se modifico la novedad'
        });
    };
});

module.exports = router;