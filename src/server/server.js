import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './connect-db';
import './initialize-db';
import { authenticationRoute } from './authenticate';
import path from 'path';

let port = process.env.PORT || 8888;
let app = express();

app.use(
    cors(),
    bodyParser.urlencoded({extended:true}),
    bodyParser.json()
);

authenticationRoute(app);

if(process.env.NODE_ENV == `production`){
    app.use(express.static(path.resolve(__dirname, `../../dist`)));
    app.get('/*',(req,res)=>{
        res.sendFile(path.resolve('index.html'));
    });
}

export const addNewTask = async task=>{
    let db = await connectDB();
    let collection = db.collection('tasks');
    await collection.insertOne(task);
}

export const updateTask = async task=>{
    let { id, group, isComplete, name } = task;
    let db = await connectDB();
    let collection = db.collection(`tasks`);

    //if (group) {
    //    await collection.updateOne({id}, {$set:{group}});
    //}

    //if (name) {
    //    await collection.updateOne({id}, {$set:{name}});
    //}

    //if (isComplete !== undefined) {
    //    await collection.updateOne({id}, {$set:{isComplete}});
    //}

    // Check if the task with the given ID exists
    let existingTask = await collection.findOne({ id });
    if (!existingTask) {
        throw new Error('Task not found');
    }

    // Update the task fields if they are provided
    let updateFields = {};
    if (group) updateFields.group = group;
    if (name) updateFields.name = name;
    if (isComplete !== undefined) updateFields.isComplete = isComplete;

    // Perform the update
    let result = await collection.updateOne({ id }, { $set: updateFields });

    // Check if the update was successful
    if (result.matchedCount === 0) {
        throw new Error('Task not found');
    }
}

app.post('/task/new',async (req,res)=>{
    try {
        let task = req.body.task;
        await addNewTask(task);
        res.status(200).send({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/task/update',async (req,res)=>{
    try {
        let task = req.body.task;
        await updateTask(task);
        res.status(200).send({ message: 'Task updated successfully' });
    } catch (error) {
        if (error.message === 'Task not found') {
            res.status(404).send({ error: 'Task not found' });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
});

app.listen(port, console.log("Server listening on port", port));