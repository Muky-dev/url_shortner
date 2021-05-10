import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
    {
    short_url: {
        type: String,
        required: true,
        unique: true
    },
    original_url: {
        type: String,
        required: true,
        unique: true
    }
},
{
    timestamps: true
}
);

const Url = mongoose.model("Url", urlSchema);
export default Url