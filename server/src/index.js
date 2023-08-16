const http=require('./app');
const PORT=process.env.PORT || 3200;

http.listen(PORT,(error)=>{

    if(!error){
        console.log(`Server is running, App is listening on port ${PORT}`);    
    } else{
        console.log(`Error occurred, server can't start`, error);
    }
    
});