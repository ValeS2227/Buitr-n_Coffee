const express = require("express")
const router = express.Router()
const db = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// POST - REGISTRO
router.post("/register", async (req,res)=>{

  const {Nombre_usuario,Apellido,Correo,Documento,Telefono,Clave} = req.body

  try{

    const hashedPassword = await bcrypt.hash(Clave,10)

    const sql = `
      INSERT INTO usuario 
      (Nombre_usuario,Apellido,Correo,Documento,Telefono,Clave,ID_Rol)
      VALUES (?,?,?,?,?,?,2)
    `

    db.query(sql,
      [Nombre_usuario,Apellido,Correo,Documento,Telefono,hashedPassword],
      (err,result)=>{
        if(err){
          return res.status(500).json(err)
        }

        res.json({message:"Usuario registrado"})
      }
    )

  }catch(error){
    res.status(500).json(error)
  }

})


//  GET - LOGIN
router.post("/login",(req,res)=>{

  const {Correo,Clave} = req.body

  const sql = "SELECT * FROM usuario WHERE Correo = ?"

  db.query(sql,[Correo],async (err,result)=>{

    if(err) return res.status(500).json(err)

    if(result.length === 0){
      return res.status(401).json({message:"Usuario no existe"})
    }

    const user = result[0]

    const validPassword = await bcrypt.compare(Clave,user.Clave)

    if(!validPassword){
      return res.status(401).json({message:"Contraseña incorrecta"})
    }

    const token = jwt.sign(
      {id:user.ID_Usuario},
      "secreto123",
      {expiresIn:"1d"}
    )

    res.json({
      message:"Login exitoso",
      token,
      usuario:{
        ID_Usuario:user.ID_Usuario,
        Nombre_usuario:user.Nombre_usuario,
        Apellido:user.Apellido,
        Correo:user.Correo,
        Documento:user.Documento,
        Telefono:user.Telefono
      }
    })

  })

})


// GET
router.get("/perfil",(req,res)=>{

  const token = req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({message:"Token requerido"})
  }

  jwt.verify(token,"secreto123",(err,decoded)=>{

    if(err){
      return res.status(401).json({message:"Token inválido"})
    }

    const sql = "SELECT * FROM usuario WHERE ID_Usuario=?"

    db.query(sql,[decoded.id],(err,result)=>{

      if(err) return res.status(500).json(err)

      res.json(result[0])

    })

  })

})


// PUT
router.put("/perfil",(req,res)=>{

  const token = req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({message:"Token requerido"})
  }

  jwt.verify(token,"secreto123",(err,decoded)=>{

    if(err){
      return res.status(401).json({message:"Token inválido"})
    }

    const {Nombre_usuario,Correo,Documento,Telefono} = req.body

    const sql = `
      UPDATE usuario
      SET Nombre_usuario=?,Correo=?,Documento=?,Telefono=?
      WHERE ID_Usuario=?
    `

    db.query(sql,
      [
        Nombre_usuario,
        Correo,
        Documento,
        Telefono,
        decoded.id
      ],
      (err,result)=>{

        if(err) return res.status(500).json(err)

        res.json({message:"Usuario actualizado"})

      }
    )

  })

})

module.exports = router