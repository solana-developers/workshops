// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default function uploadFile(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    saveFile(files.file);
    return res.status(201).send("");
  });
};

const saveFile = (file) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/uploads/nft-img.${file.originalFilename.split('.').pop()}`, data);
  fs.unlinkSync(file.filepath);
  return;
};
