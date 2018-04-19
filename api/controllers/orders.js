const mongoose = require('mongoose')

/*mongoose Model*/
const OrderModel = require('../models/order')
const ProductModel = require('../models/product')

/*GET /orders*/
exports.getAll = (req,res,next)=>{
  OrderModel.find()
  .select('product quantity _id')
  .populate('product','name price _id')
  .exec()
  .then((docs)=>{
    let response = {
      count:docs.length,
      orders:docs.map((doc)=>{
        return {
          product:doc.product,
          quantity:doc.quantity,
          _id:doc._id,
          request:{
            type:'GET',
            url:`http://localhost:3000/orders/${doc._id}`
          }
        }
      })
    }
    res.status(200).json(response)
  }).catch((err)=>{
    res.status(500).json({error:err})
  })
}

/*POST /orders*/
exports.create =  (req,res,next)=>{
  ProductModel.findById(req.body.productId)
  .then((product)=>{
    if(!product) return res.status(404).json({msg:'Product Not found'})

    const order = new OrderModel({
      _id:mongoose.Types.ObjectId(),
      quantity:req.body.quantity,
      product:req.body.productId
    })
    return order.save()
  }).then((result)=>{
    let response = {
      productId:result.product,
      quantity:result.quantity,
      _id:result._id,
      request:{
        type:'GET',
        url:`http://localhost:3000/orders/${result._id}`
      }
    }
    //201 Created
    res.status(201).json(response)
  }).catch((err)=>{
    res.status(500).json({error:err})
  })
}

/*GET /orders/{id}*/
exports.getById = (req,res,next)=>{
  const {orderId} = req.params
  OrderModel.findById(orderId)
  .populate('product','name price _id')
  .exec()
  .then((doc)=>{
    if(doc){
      let response = {
        product:doc.product,
        quantity:doc.quantity,
        _id:doc._id,
        request:{
          type:'GET',
          url:`http://localhost:3000/orders/${doc._id}`
        }
      }
      res.status(200).json(response)
    }else{
      res.status(404).json({msg:'No valid entry found for provided ID'})
    }
  }).catch((err)=>{
    res.status(500).json({error:err})
  })
}

/*DELETE /orders/{id}*/
exports.deleteById = (req,res,next)=>{
  const {orderId} = req.params
  OrderModel.remove({_id:orderId}).exec()
  .then((result)=>{
    let response = {
      ts:Object.assign({},result.opTime.ts),
      request:{
        type:'DELETE',
        url:`http://localhost:3000/orders/${orderId}`
      }
    }
    res.status(200).json(response)
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).json({error:err})
  })
}
