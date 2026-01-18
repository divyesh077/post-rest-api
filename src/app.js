import express from 'express';

const app = express();

app.get('/',(req,res) => {
    res.status(200).json({
        success:true,
        message:'API running'
    })
})

export default app;