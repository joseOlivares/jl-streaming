const {Router} = require('express');
const router=Router();



router.get('/', (req,res)=>{
    res.redirect('viewer.html');
});

router.get('/emit', (req,res)=>{
    res.redirect('index.html');
});

router.get('/test', (req,res)=>{
    res.json({ok:true});
    console.log('llega a test');
});


module.exports=router;