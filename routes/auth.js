const express = require('express');
const User= require('../models/User');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'P@rajL@ves$u$h';



// Create a User or Admin using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/creatuser',[
    
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
] , async(req, res)=>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    } 
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user= await User.create({
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Middlename: req.body.Middlename,
        password: secPass,
        email: req.body.email,
        role: req.body.role,
        department:req.body.department
      });
       const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      
  
      // res.json(user)
      res.json({authtoken})
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
} )

module.exports = router