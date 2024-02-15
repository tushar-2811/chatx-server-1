import {z} from 'zod'

export const SignUpSchema = z.object({
    username : z.string().min(3 , {
        message : "Name is too short !"
    }).max(255),

    email : z.string().email(),
    password : z.string().min(5 , {
        message : "Password too short !"
    }).max(255),
  

})

export const SignInSchema = z.object({
    username : z.string().min(3 , {
        message : "Name is too short !"
    }).max(255),
    password : z.string().min(5 , {
        message : "Password too short !"
    }).max(255),

})