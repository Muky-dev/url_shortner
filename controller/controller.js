import Url from '../models/Url.js';
import dns from 'dns';
import uniqueHash from './hasher.js'


export async function postUrl(req, res) {
    const url = req.body.url;
    const hashed = uniqueHash(url.hashCode());
    //const test_reg = /^http(s?):\/\/(www\.\w+|\w+)\.\w{1,5}/i
    const replace_reg = /^http(s?):\/\//i
    const url_replaced = url.replace(replace_reg, '');
    if (!replace_reg.test(url)) {
        res.status(500).json({ error: 'invalid url' });
    } else {
        try {
            const ipAddress = await lookup(url_replaced);
            const modeled = {
                original_url: url,
                short_url: hashed
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
        } catch {
            res.status(500).json({"error":"invalid url" });
        }
    }
}
async function lookup(hostname) {
    return new Promise((resolve, reject) => {
        dns.lookup(hostname, (err, address, family) => {
            if (err) {
                reject(err);
            } else {
                resolve(address);
            }
        });
    });
}

export async function getUrl(req, res) {
    const shortUrl = req.params.short_url;

    try {
        const url = await Url.findOne({ short_url: shortUrl });
        res.redirect(url.original_url);
    } catch (error) {
        res.status(500).json({ message: "Inexistent URL" });
    }
}