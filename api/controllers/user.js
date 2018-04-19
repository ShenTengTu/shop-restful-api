const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

/*mongoose Model*/
const UserModel = require('../models/user')

exports.signup = (req,res,next)=>{
  UserModel.find({email:req.body.email}).exec()
  .then((users)=>{
    if(users.length >= 1) {
      //409 Conflict or 422 Unprocessable Entity
      return res.status(409).json({
        message:'Account exists.'
      })
    }else{
      return bcrypt.hash(req.body.password, 10)
    }
  }).then((hash)=>{
    const user = new UserModel({
      _id:new mongoose.Types.ObjectId(),
      email:req.body.email,
      password:hash
    })
    return user.save()
  }).then((result)=>{
    let response = {
      user:result,
      request:{
        type:'POST',
        url:`http://localhost:3000/user/${result._id}`
      }
    }
    //201 Created
    res.status(201).json(response)
  }).catch((err)=>{
    res.status(500).json({error:err})
  });
}

exports.login = (req,res,next)=>{
  UserModel.find({email:req.body.email}).exec()
  .then((users)=>{
    if(users.length < 1){
      //401 Unauthorized
      return res.status(401).json({
        message:'Auth failed'
      })
    }else{
      const verifyResult = bcrypt.compareSync(req.body.password, users[0].password)
      if(!verifyResult){
        //401 Unauthorized
        return res.status(401).json({
          message:'Auth failed'
        })
      }else{
        const token = jwt.sign({
          email:users[0].email,
          userId:users[0]._id
        },
        process.env.JWT_KEY,
        {
          expiresIn:"1h"
        })

        let response = {
          token:token,
          request:{
            type:'POST',
            url:`http://localhost:3000/user/${users[0]._id}`
          }
        }
        return res.status(200).json(response)
      }
    }
  }).catch((err)=>{
    res.status(500).json({error:err})
  })
}

exports.deleteById = (req,res,next)=>{
  const {userId} = req.params
  UserModel.remove({_id:userId}).exec()
  .then((result)=>{
    let response = {
      ts:Object.assign({},result.opTime.ts),
      request:{
        type:'DELETE',
        url:`http://localhost:3000/user/${userId}`
      }
    }
    res.status(200).json(response)
  })
  .catch((err)=>{
    res.status(500).json({error:err})
  })
}
