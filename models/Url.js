const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
    short_url: {
        type: String,
        required: true
    },
    original_url: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
);

const Url = mongoose.model("Url", urlSchema);
export default Url