import jwt from "jsonwebtoken";

const genToken = async (userId)=>{
    try {
        const secreat = process.env.JWT_SECRET || Ujjwal291210
        const token = jwt.sign({userId},secreat ,{
            expiresIn: "30y"
        });
        return token;
    } catch (error) {
        console.error(`genToken Error :- ${error}`)
    }
}

export default genToken;