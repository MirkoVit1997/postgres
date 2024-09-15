import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:postgres@localhost:5432/jwt");

async function setupDb() {
  await db.none(`
    DROP TABLE IF EXISTS planets;

    CREATE TABLE planets(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255)
    );

    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    token TEXT
    );
    `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth'), ('Mars')`);
  await db.none(`INSERT INTO users (username, password) VALUES ('dummy', 'dummy'), ('a', 'a')`)
}

setupDb();

export {db}