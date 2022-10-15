import db from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function SignIn(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(422).send("Preencha os campos em vazios!");
    }

    const checkUsers = await db.query(
      `
        SELECT * FROM users WHERE email=$1
        `,
      [email]
    );
    const id = checkUsers.rows.map((item) => item.id);
    const senha = checkUsers.rows.map((item) => item.password)
    const key = process.env.JWT_SECRET;

    const checkToken = await db.query(
      `
        SELECT * FROM sessions WHERE iduser=$1
    `,
      [id.join()]
    );

    if(bcrypt.compareSync(password, senha.join()) == false) {
      return res.status(401).send("Senha incorreta.");
    }

    if (checkToken.rows.length > 0) {
      await db.query(`DELETE FROM sessions WHERE iduser=$1`, [id.join()]);
    }

    if (checkUsers.rows.length > 0) {
      const token = jwt.sign(password, key);

      await db.query(
        `
            INSERT INTO sessions (token, iduser) VALUES ($1, $2)
            `,
        [token, id.join()]
      );

      const sendToken = {
        token: token,
      };

      res.send(sendToken);
    } else {
      return res.status(401).send("Usuário incompátivel ou inexistente");
    }
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}
