const express = require('express');
const UserAdminSchema = require('../models/useradmin.js');
const router = express.Router(); 


// Create a User or Admin using: POST "/api/auth/". Doesn't require Auth
router.post('/', (req, res)=>{ 
    console.log(req.body);
    const useradmin = UserAdminSchema(req.body);
    useradmin.save()
    res.send(req.body);
    console.log(req.body);
} )

module.exports = router