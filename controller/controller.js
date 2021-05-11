import Url from '../models/Url.js';
import dns from 'dns';
import uniqueHash from './hasher.js'


export async function postUrl(req, res) {
    const url = req.body.url;
    //const test_reg = /^http(s?):\/\/(www\.\w+|\w+)\.\w{1,5}/i
    const replace_reg = /^http(s?):\/\//i
    const url_replaced = url.replace(replace_reg, '');
    if (!replace_reg.test(url)) {
        res.json({ error: 'invalid url' });
    } else {
        try {
            const ipAddress = await lookup(url_replaced);
            const hashed = uniqueHash(ipAddress.hashCode());
            console.log(hashed);
            const modeled = {
                original_url: url,
                short_url: hashed
            }
            try {
                await new Url(modeled).save();
                res.json(modeled);
            } catch (error) {
                if (error.code === 11000) {
                    res.json(modeled);
                } else {
                    res.json(error);
                }
            }
        } catch {
            res.json({"error":"invalid url" });
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
        res.json({ message: "Inexistent URL" });
    }
}