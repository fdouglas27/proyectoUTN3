var express = require('express');
var router = express.Router();
var noveltiesModel = require('../../models/noveltiesModel');
var cloudinary = require('cloudinary').v2;

router.get('/novedades', async function (req, res, next) {
    let novelties = await noveltiesModel.getNovelties();

    novelties = novelties.map(novelties => {
        if (novelties.novelties_img_id) {
            const image = cloudinary.url(novelties.novelties_img_id, {
                width: 960,
                height: 200,
                crop: 'fill'
            });
            return {
                ...novelties,
                image
            }
        } else {
            return {
                ...novelties,
                image:''
            }
        }
    });

    res.json(novelties);
});

module.exports = router;