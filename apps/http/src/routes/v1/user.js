import express from 'express';
import { UpdateMetadataSchema } from '../../types/index.js';
import db from '@repo/db';
import { userMiddleware } from '../../middlewares/user.js';

const router = express.Router();

router.post("/metadata",userMiddleware,async (req,res)=>{
   const parsedData=UpdateMetadataSchema.safeParse(req.body);
   if(!parsedData.success){
       return res.status(403).json({
           message:"Invalid request data",
           errors:parsedData.error.errors
       });
   }
   try{
    const updatedData=await  db.user.update({
        where:{
            id:req.userId //the middleware running between will attach userId to req
        },
        data:{
            avatarId:parsedData.data.avatarId,
        }
        
    })

    return res.status(200).json({
        message:"Metadata updated successfully",
       
    });

   }catch(error){
         return res.status(400).json({
              message:"Internal server error"
         });

   }

});

router.get("/metadata/bulk", async (req, res) => {
    const userIdString = (req.query.ids ?? "[]");
    const userIds = (userIdString).slice(1, userIdString?.length - 1).split(",");
    console.log(userIds)
    const metadata = await db.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }, select: {
            avatar: true,
            id: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
})
  
export default router;
