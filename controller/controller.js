import Url from '../models/Url.js';
import uniqueHash from './hasher.js'


export async function postUrl(req, res) {
    const url = req.body.url;
    const hashed = uniqueHash(url.hashCode());
    const modeled = {
        short_url: hashed,
        original_url: url
    }
    try {
        await new Url(modeled).save();
        res.status(200).json(modeled);
    } catch (error) {
        if (error.code === 11000) {
            res.status(200).json(modeled);
        } else {
            res.status(500).json(error);
        }
    }
}

export async function getUrl(req, res) {
    
}