import { Request, Response } from "express";
import Joi from "joi";
import { db } from "../src/db";

const updatePlanetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

async function getAll(req: Request, res: Response) {
  try {
    const planets = await db.many(`SELECT * FROM planets`);
    res.status(200).json(planets);
    console.log("Retrieved the planets");
  } catch (error) {
    res.status(500).json({ msg: "Error Retrieveng Planets" });
    console.error(error);
  }
}

async function getOneById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const planet = await db.oneOrNone(
      `SELECT * FROM planets WHERE id=$1`,
      Number(id)
    );

    if (planet) {
      res.status(200).json(planet);
      console.log(`Retrieved selected planet`);
    } else {
      res.status(404).json({ msg: "Planet not found" });
      console.log("Planet not found");
    }
  } catch (error) {
    res.status(500).json({ msg: "Error Retrieveng Planet" });
    console.error(error);
  }
}

async function create(req: Request, res: Response) {
  const { name } = req.body;
  const newPlanet = { name };

  const { error, value } = planetSchema.validate(newPlanet, {
    abortEarly: false,
  });

  /* I use the abortEarly:false to see on the log if there is more than one error*/
  if (error) {
    console.log(error.details);
    return res.status(400).json({ msg: "Wrong Parameters" });
  }

  try {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
    res.status(201).json({ msg: "The planet was added" });

    console.log("New Planet added to the list");
  } catch (error) {
    res.status(500).json({ msg: "Error Creating New Planet" });
    console.error(error);
  }
}

async function updateById(req: Request, res: Response) {
  const { id } = req.params;
  const { name } = req.body;
  const { error, value } = updatePlanetSchema.validate({ id, name });

  if (error) {
    console.log(error.details);
    return res.status(400).json({ msg: "Wrong Parameter" });
  }

  try {
    const planet = await db.oneOrNone(
      `SELECT * FROM planets WHERE id=$1`,
      Number(id)
    );
    if (planet) {
      await db.none(`UPDATE planets set name=$2 WHERE id=$1`, [
        Number(id),
        name,
      ]);

      res.status(200).json({ msg: "Planet updated" });
      console.log("Planet Updated");
    } else {
      return res.status(404).json({ msg: "Planet not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error updating the Planet" });
    console.error(error);
  }
}

async function deleteById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));
    console.log("Planet Deleted");
    res.status(200).json({ msg: "Planet Deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error Deleting the planet" });
    console.error(error);
  }
}

async function createImage(req: Request, res: Response) {
  const { id } = req.params;
  const fileName = req.file?.path;

  console.log(req.file);

  if (fileName) {
    try {
      await db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [
        Number(id),
        fileName,
      ]);
      res.status(201).json({ msg: "Planet image uploaded successfully" });
      console.log("Planet image uploaded succesfully");
    } catch (error) {
      res.status(500).json({ msg: "Error Uploading the image" });
      console.error(error);
    }
  } else {
    res.status(400).json({ msg: "Planet image failed to upload" });
  }
}

export { getAll, getOneById, create, updateById, deleteById, createImage };
