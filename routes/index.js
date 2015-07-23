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
  res.render('index', {articles: data.sort().reverse()});
  }
  })
});


router.get('/new', function(req,res,next){
  res.render('new')
})


router.post('/new', function(req,res,next){
  var error = []
  if(req.body.title.length<2 ){
    error.push('Your title cannot be empty')
  }
    if(req.body.body.length<2){
      error.push('Your body cannot be empty')
  }

  if(req.body.excerpt.length <2){
      error.push('Your excerpt cannot be empty')
  }

  if(error.length>=1){
    res.render('new', {error: error})
  }

  else {
  Article.create({
    title: req.body.title,
    artUrl: req.body.url || 'http://www.stitchdesignco.com/content/uploads/2011/11/Pattern3.jpg',
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
  }
})


router.get('/show/:id', function(req,res,next){
  Article.findById({
    _id: req.params.id
  },
  function(err,data){
    var x = data.backgroundImg;
      // if(x===true){
      //   data.title.style.color = 'white';
      // }
    res.render('show', {id: req.params.id, title: data.title, url: data.artUrl, img: data.backgroundImg, excerpt: data.excerpt, body: data.body})
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
  var error = []
  if(req.body.title.length<2 ){
    error.push('Your title cannot be empty')
  }
  if(req.body.body.length<2){
    error.push('Your body cannot be empty')
  }
  if(req.body.excerpt.length <2){
    error.push('Your excerpt cannot be empty')
  }
  if(error.length>=1){
    Article.findById({
      _id: req.params.id
    },
    function(err,data){
      res.render('update',{error: error, id: req.params.id, title: data.title, url: data.artUrl,  img: data.backgroundImg, excerpt:data.excerpt, body:data.body})
    })
  }

  else{
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
}

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
