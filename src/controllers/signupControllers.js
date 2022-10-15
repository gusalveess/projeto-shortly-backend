import db from "../database.js";
import bcrypt from 'bcrypt'

export async function SignUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (!name || !email || !password || !confirmPassword) {
      return res.status(422).send("Preencha os campos em vazios!");
    }
    if (password != confirmPassword) {
      return res.status(422).send("As senhas precisam ser iguais!");
    }

    const checkDuplicate = await db.query(`
        SELECT * FROM users WHERE email=$1        
        `,[email]);

        if(checkDuplicate.rows.length > 0) {
            return res.sendStatus(409).send('Já existe um usuário cadastrado com esse e-mail.')
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        
        await db.query(`
        INSERT INTO users (username, email, password) VALUES ($1, $2, $3)
        `, [name, email, passwordHash])
        
        res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}
