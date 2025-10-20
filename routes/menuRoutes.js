const express = require('express');
const router = express.Router();
const { 
    getMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu  
} = require('../controllers/menuController');

router.get('/', getMenus);
router.get('/:id', getMenuById);
router.post('/', createMenu);  
router.put('/:id', updateMenu);  
router.delete('/:id', deleteMenu);

module.exports = router;
