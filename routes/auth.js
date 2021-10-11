const express = require('express');
const User= require('../models/User');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');



// Create a User or Admin using: POST "/api/auth/". Doesn't require Auth
router.post('/',[
    
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
] , (req, res)=>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Middlename: req.body.Middlename,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role,
        department:req.body.department
      }).then(user => res.json(user))
      .catch(err=> {console.log(err)
    res.json({error: 'Please enter a unique value for email', message: err.message})})
} )

module.exports = router