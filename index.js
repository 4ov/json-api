const express = require('express');
const _ = require('lodash');
const path = require('path');
const fs = require('fs/promises');

const PORT = process.env.PORT || 3000;
const SEARCH_DIR = process.env.SEARCH_DIR || 'f';


fs.stat(SEARCH_DIR).then(d=>{
    if(!d.isDirectory()){
        throw new Error('SEARCH_DIR is not a directory');
    }
}).catch(err=>{
    console.error(err);
    process.exit(1);
})


const app = express();


app.get('/f/:name', async (req, res)=>{
    const query = req.query.q
    const fName = req.params.name + '.json';
    const fPath = path.resolve(__dirname, SEARCH_DIR, fName);
    const data = fs.readFile(fPath, { encoding : 'utf8' })
    data.then(d=>{
        if(query){  
            res.json({
                ok  : true,
                data : _.get(JSON.parse(d), query)
            })
        }else{
            res.json({
                ok : true,
                data : JSON.parse(d)
            });
        }
    }).catch(err=>{
        let errM = ''
        if(err instanceof SyntaxError){
            errM = 'Cannot parse file'
        }else if(err.code === 'ENOENT'){
            errM = 'File not found'
        }
        res.json({
            ok : false,
            error : errM
        })
    })
})



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})



