const express = require('express')
const router = express.Router()
const multer = require('multer')

/*checkAuth middleware*/
const checkAuth = require('../middleware/check-auth')

/*Multer Storage Strategy*/
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null,'./uploads/')
  },
  filename: function (req, file, cb){
    const now = new Date().toISOString()
    //Windows does not accept filenames with colon (':')
    const date = now.replace(/:/g, '-')//replace : to -
    cb(null, date + file.originalname)
  }
})
const fileFilter = (req, file, cb)=>{
  const {mimetype} = file
  console.log(mimetype)
  const isJPEG = mimetype === 'image/jpeg'
  const isPNG = mimetype === 'image/png'
  if(isJPEG || isPNG) {
    cb(null, true)
  }else{
    cb(new Error(`Only support image/jpeg & image/png.`), false)
  }
}
const upload = multer({
  storage:storage,
  limits:{
    fileSize: 1024*1024*5 //5MB
  },
  fileFilter:fileFilter
})

/*controllers*/
const ProductsController = require('../controllers/products');

/*GET /products*/
router.get('/', ProductsController.getAll)

/*POST /products
need Auth*/
router.post('/', checkAuth, upload.single('productImage'), ProductsController.create)

/*GET /products/{id}*/
router.get('/:productId', ProductsController.getById)

/*PATCH /products/{id}
need Auth*/
router.patch('/:productId', checkAuth, ProductsController.updateById)

/*DELETE /products/{id}
need Auth*/
router.delete('/:productId', checkAuth, ProductsController.deleteById)

module.exports = router
