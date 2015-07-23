var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI || process.env.KEY);
mongoose.set('debug', true);



var articlesSchema = new mongoose.Schema({
  title: String,
  artUrl: String,
  backgroundImg: Boolean,
  excerpt: String,
  body: String
});

var Article =  mongoose.model("article", articlesSchema);



router.get('/', function(req, res, next) {
  Article.find({}, function(err,data){
    if(err){
      res.render('index')
    }else{
  res.render('index', {articles: data });
  }
  })
});


router.get('/new', function(req,res,next){
  res.render('new')
})


router.post('/new', function(req,res,next){
  Article.create({
    title: req.body.title,
    artUrl: req.body.url,
    backgroundImg: req.body.img,
    excerpt: req.body.excerpt,
    body: req.body.body
  }, function(err, data){
    if(err){
      res.render('new', {warning: 'Information entered is invalid'})
    } else{
      res.redirect('/')
    }
  }
  )
})


router.get('/show/:id', function(req,res,next){
  Article.findById({
    _id: req.params.id
  },
  function(err,data){
    res.render('show', {id: data._id, title: data.title, url: data.artUrl, img: data.backgroundImg, excerpt: data.excerpt, body: data.body})
  })
})


router.get('/show/:id/update', function(req,res,next){
  Article.findById({
    _id: req.params.id
  },
  function(err,data){
    res.render('update',{id: req.params.id, title: data.title, url: data.artUrl,  img: data.backgroundImg, excerpt:data.excerpt, body:data.body})
  })
})


router.post('/show/:id/update',function(req,res,next){
  Article.update({
      _id: req.params.id
    },
    {
       title: req.body.title, artUrl: req.body.url,  backgroundImg: req.body.img, excerpt:req.body.excerpt, body:req.body.body
    },
    function(err,ok){
      if(ok){
        res.redirect('/')
      } else{
        res.render('update')
      }
    }
  )
})


router.post('/show/:id/delete',function(req,res,next){
  Article.remove({
    _id: req.params.id
  },
   function(err,ok){
    if(ok){
      res.redirect('/')
    }
  })
})




module.exports = router;
