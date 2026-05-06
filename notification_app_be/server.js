require('dotenv').config();
const express=require('express');
const cors=require('cors');
const {Pool}=require('pg');
const {Logger,loggingMiddleware}=require('../logging_middleware/logger');

const app=express();
const logger=new Logger({serviceName:'notification-api'});

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware(logger));

const pool=new Pool({
  host:'localhost',
  database:'notifications',
  user:'postgres',
  password:process.env.DB_PASSWORD,
  port:5433
});
console.log(process.env.DB_PASSWORD);
app.post('/api/notifications',async(req,res)=>{

  try{

    const {student_id,message}=req.body;

    const result=await pool.query(
      `insert into notifications(student_id,type,message,timestamp,is_read)
       values($1,$2,$3,now(),false)
       returning id`,
      [student_id,'Event',message]
    );

    logger.info('Notification created');

    res.status(201).json({
      id:result.rows[0].id,
      message:'Notification created'
    });

  }catch(error){

    console.log(error);

    logger.error('Create notification failed');

    res.status(500).json({
      error:'Server error'
    });
  }

});

app.get('/api/notifications',async(req,res)=>{

  try{

    const {student_id}=req.query;

    const result=await pool.query(
      `select id,student_id,type,message,timestamp,is_read
       from notifications
       where student_id=$1
       order by timestamp desc
       limit 20`,
      [student_id]
    );

    res.json({
      data:result.rows
    });

  }catch(error){

    console.log(error);

    logger.error('Fetch notification failed');

    res.status(500).json({
      error:'Server error'
    });
  }

});

app.patch('/api/notifications/:id/read',async(req,res)=>{

  try{

    const {id}=req.params;

    await pool.query(
      `update notifications
       set is_read=true
       where id=$1`,
      [id]
    );

    res.json({
      message:'Marked as read'
    });

  }catch(error){

    console.log(error);

    logger.error('Update failed');

    res.status(500).json({
      error:'Server error'
    });
  }

});

const PORT=3000;

app.listen(PORT,()=>{
  console.log(`Server running on ${PORT}`);
});