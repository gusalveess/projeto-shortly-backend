import { nanoid } from "nanoid";
import db from "../database.js";

export async function Short(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const { url } = req.body;
  let short = url;
  const checkUser = await db.query(
    `
    SELECT * FROM sessions WHERE token=$1
  `,
    [token]
  );
  const userId = checkUser.rows.map((item) => item.iduser);
  try {

    if (checkUser.rows.length < 1) {
      return res.status(401).send("Token inválido.");
    }

    if (!authorization) {
      return res.status(401).send("Sem Token de acesso.");
    }

    if (!url) {
      return res.status(422).send("Preencha o campo vazio!");
    }

    short = nanoid(8);

    await db.query(
      `
    INSERT INTO urls (url, userid, shorturl, countviews) VALUES ($1, $2, $3, $4)
    `,
      [url, userId.join(), short, 0]
    );

    const sendShort = {
      shortUrl: short,
    };

    res.status(201).send(sendShort);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export async function shortId(req, res) {
  const { id } = req.params;

  try {
    const checkUrl = await db.query(
      `
            SELECT urls.id, shorturl, url FROM urls WHERE urls.id = $1
        `,
      [id]
    );

    if (checkUrl.rows.length < 1) {
      return res.status(404).send("URL inexistente.");
    }

    res.status(200).send(checkUrl.rows);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export async function openShort(req, res) {
  const { shortUrl } = req.params;

  try {
    const checkShort = await db.query(
      `
            SELECT * FROM urls WHERE shorturl=$1
        `,
      [shortUrl]
    );

    if (checkShort.rows.length < 1) {
      res.status(404).send("URL inexistente.");
    }

    const url = checkShort.rows.map((item) => item.url);

    await db.query(
      `
            UPDATE urls SET "countviews"= "countviews"+1 WHERE shorturl=$1
        `,
      [shortUrl]
    );
    res.redirect(url.join());
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const checkUrls = await db.query(`SELECT * FROM urls WHERE id=$1`, [id]);
  const checkSessions = await db.query(
    `SELECT * FROM sessions WHERE token=$1`,
    [token]
  );
  const idUrl = checkUrls.rows.map((item) => item.userid);
  const idSessions = checkSessions.rows.map((item) => item.iduser);

  try {
    if (checkUrls.rows.length < 1) {
      res.status(404).send("URL inexistente.");
    }

    if (checkSessions.rows.length < 1) {
      return res.status(401).send("Token inválido.");
    }

    if (!authorization) {
      return res.status(401).send("Sem Token de acesso.");
    }

    if (idUrl.join() != idSessions.join()) {
      return res.status(401).send("URL pertencente a outro usuário.");
    }

    await db.query(`DELETE FROM urls WHERE id=$1`, [id]);
    res.status(204).send("Deletado com sucesso.");
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}
