import db from "../database.js";

export async function Me(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const checkToken = await db.query(`SELECT * FROM sessions WHERE token=$1`, [
      token,
    ]);
    const idUser = checkToken.rows.map((item) => item.iduser);

    const infoUser = await db.query(
      `
        SELECT users.id as "id", users.username as "name", SUM(urls.countviews) as "visitCount" FROM users JOIN urls ON users. "id" = users.id WHERE users.id=$1 GROUP BY users.id;
        `,
      [idUser.join()]
    );

    const infoUrls = await db.query(
      `SELECT urls.id, urls.shorturl as "shortUrl", urls.url, urls.countviews as "visitCount" FROM urls WHERE urls.userid = $1;`,
      [idUser.join()]
    );

    if (!authorization) {
      return res.status(401).send("Sem Token de acesso.");
    }

    if (checkToken.rows.length < 1) {
      return res.status(404).send("Usuário Inexistente.");
    }

    const info = { ...infoUser.rows[0], shortenedUrls: infoUrls.rows };

    res.status(200).send(info);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

export async function Ranking(req, res) {
  try {
    const ranked = await db.query(`SELECT users.id, users.username as "name",
    COUNT(urls.id) as "linksCount",
    COALESCE(SUM(urls.countviews),0) as "visitCount"
    FROM urls
    RIGHT JOIN users ON urls."userid"=users.id
    GROUP BY users.id
    ORDER BY "visitCount" DESC
    LIMIT 10`);

    res.status(200).send(ranked.rows);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}
