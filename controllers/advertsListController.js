import Advert from "../models/advertModel.js";

//Logica del listado

export async function advertsList(req, res, next) {
  try {
    const adverts = await Advert.find();
    res.json({ success: true, results: adverts })
  } catch (err) {
    next(err)
  }
}