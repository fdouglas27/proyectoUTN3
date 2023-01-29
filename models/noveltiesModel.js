var pool = require('../models/db');

async function getNovelties() {
    var query = 'select * from novelties';
    var rows = await pool.query(query);
    return rows;
}

async function insertNovelty(obj) {
    try {
        var query = 'insert into novelties set ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function deleteNoveltiesById(id) {
    var query = 'delete from novelties where novelties_id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

async function getNoveltyById(id) {
    var query = 'select * from novelties where novelties_id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function updateNoveltyById(obj, id) {
    try{
    var query = 'update novelties set ? where novelties_id = ?'
    var rows = await pool.query(query, [obj, id])
    return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {getNovelties, insertNovelty, deleteNoveltiesById, getNoveltyById, updateNoveltyById};