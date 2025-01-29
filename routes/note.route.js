import express from "express"
import NoteModel from "../models/note.model.js";

const noteRouter = express.Router();

noteRouter.get("/", async(req, res) =>{
    const userId = req.user._id;
    try{
        const noteData = await NoteModel.find({userId});
        res.status(201).json({msg:"note data fetched successfully.", noteData})
        
    }catch(err){
        res.send(`Err occured while fetching note ${err}`)
    }
})
noteRouter.post('/create', async(req, res) =>{
    const{title, desc, status} = req.body;
    const userId = req.user._id
    try{
        const newNote= new NoteModel({
            title, 
            desc, 
            status,
            userId
        })
        await newNote.save();
        res.status(201).json({msg:"Note created successfully",  newNote})
    }catch(err){
        res.send(`Err occurd while creating note: ${err}`)
    }
})

// update notes
noteRouter.patch("/update/:id", async(req, res) =>{
    const noteId = req.params.id
    const userId = req.user._id
    try{
        const note = await NoteModel.findOne({_id:noteId})
        if(note.userId.toString() == userId.toString()){
            await NoteModel.findByIdAndUpdate({_id:noteId}, req.body)
            res.status(201).json({msg:"Note updated successfully!"})
        }else{
            return res.status(401).json({msg:"Unauthorized"})
        }
        
    }catch(err){
        res.status(403).json({msg:"Err occured while updating note", err})
    }
})

noteRouter.delete("/delete/:id", async(req, res) =>{
    const noteId = req.params.id
    const userId = req.user._id
    try{
        const note = await NoteModel.findOne({_id:noteId})
        if(note.userId.toString() == userId.toString()){
            await NoteModel.findByIdAndDelete({_id:noteId})
            res.status(201).json({msg:"Note deleted successfully!"})
        }else{
            res.status(401).json({msg:"Unauthorized"})
        }
    }catch(err){
        res.send(`Err occured while delteing note: ${err}`)
    }
})

export default noteRouter;