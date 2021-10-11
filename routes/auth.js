const express = require('express');
const User= require('../models/User');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');







const JWT_SECRET = 'P@rajL@ves$u$h';



// Create a User or Admin using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/creatuser',[
    
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be 6 to 12 characters').isLength({ min: 6, max:12 }),
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


// Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [ 
    body('email', 'Enter a valid email').isEmail(), 
    body('password', 'Password cannot be blank').exists(), 
  ], async (req, res) => {
  
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Please try to login with correct credentials"});
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({error: "Please try to login with correct credentials"});
      }
  
      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({authtoken})
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  
  
  })
// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,async (req, res) => {

    try {
      userId = req.user.id;
      
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
  

  // ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updateuser/:id', fetchuser, async (req, res) => {

    const { Firstname,Middlename,Lastname,email,role,department } = req.body;
    try {
        // Create a newUser object
        const newUser = {};
        if (Firstname) { newUser.Firstname = Firstname };
        if (Middlename) { newUser.Middlename = Middlename };
        if (Lastname) { newUser.Lastname = Lastname };
        if (email) { newUser.email = email };
        if (role) { newUser.role = role };
        if (department) { newUser.department = department };



        
        
        // Find the user to be updated and update it
        var user = await User.findById(req.user.id).select("-password")
        if (!user) { return res.status(404).send("Not Found") }

      

        if (user.id.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        user = await User.findByIdAndUpdate(req.params.id, { $set:{Firstname:req.body.Firstnamt ,Lastname:req.body.Lastname,Middlename:req.body.Middlename,email:req.body.email,role:req.body.role,department:req.body.department}}, { new: true })
       
        res.json({ user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router