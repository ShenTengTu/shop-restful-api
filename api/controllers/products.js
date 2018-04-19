const mongoose = require('mongoose')

/*mongoose Model*/
const ProductModel = require('../models/product')

/*GET /products*/
exports.getAll = (req,res,next)=>{
  ProductModel.find().select("name price productImage _id").exec()
  .then((docs)=>{
    let response = {
      count:docs.length,
      products:docs.map((doc)=>{
        return {
          name:doc.name,
          price:doc.price,
          productImage:doc.productImage,
          _id:doc._id,
          request:{
            type:'GET',
            url:`http://localhost:3000/products/${doc._id}`
          }
        }
      })
    }
    res.status(200).json(response)
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).json({error:err})
  })
}

/*POST /products*/
exports.create = (req,res,next)=>{
  const product = new ProductModel({
    _id:mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })

  product.save().then((result)=>{
    let response = {
      name:result.name,
      price:result.price,
      productImage:result.productImage,
      _id:result._id,
      request:{
        type:'POST',
        url:`http://localhost:3000/products/${result._id}`
      }
    }
    //201 Created
    res.status(201).json(response)
  }).catch((err)=>{
    console.log(err)
    res.status(500).json({error:err})
  })
}

/*GET /products/{id}*/
exports.getById = (req,res,next)=>{
  const {productId} = req.params

  ProductModel.findById(productId).select("name price _id productImage").exec()
  .then((doc)=>{
    if(doc){
      let response = {
        name:doc.name,
        price:doc.price,
        productImage:doc.productImage,
        _id:doc._id,
        request:{
          type:'GET',
          url:`http://localhost:3000/products/${doc._id}`
        }
      }
      res.status(200).json(response)
    }else{
      res.status(404).json({msg:'No valid entry found for provided ID'})
    }
  }).catch((err)=>{
    console.log(err)
    res.status(500).json({error:err})
  })
}

/*PATCH /products/{id}*/
exports.updateById = (req,res,next)=>{
  const {productId} = req.params
  const updateOps = {}
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value
  }
  ProductModel.update({_id:productId},{$set:updateOps}).exec()
  .then((result)=>{
    let response = {
      ts:Object.assign({},result.opTime.ts),
      request:{
        type:'PATCH',
        url:`http://localhost:3000/products/${productId}`
      }
    }
    res.status(200).json(response)
  }).catch((err)=>{
    console.log(err)
    res.status(500).json({error:err})
  })
}

/*DELETE /products/{id}*/
exports.deleteById = (req,res,next)=>{
  const {productId} = req.params
  ProductModel.remove({_id:productId}).exec()
  .then((result)=>{
    let response = {
      ts:Object.assign({},result.opTime.ts),
      request:{
        type:'DELETE',
        url:`http://localhost:3000/products/${productId}`
      }
    }
    res.status(200).json(response)
  })
  .catch((err)=>{
    res.status(500).json({error:err})
  })
}
