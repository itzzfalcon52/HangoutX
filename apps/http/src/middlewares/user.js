import jwt from 'jsonwebtoken';

export const userMiddleware=(req,res,next)=>{
    const header=req.headers.authorization;  //Bearer hihewccweew1cv3q
    const token=header?.split(" ")[1];
    if(!token){
        return res.status(403).json({
            message:"Unauthorized.No token provided"
        });
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role!=="User" && decoded.role!=="Admin"){
            return res.status(403).json({
                message:"Forbidden.access required"
            });
        }
        req.userId=decoded.userId;
        next();



    }catch(error){
        return res.status(401).json({
            message:"Unauthorized.Invalid token"
        });
    }
}