import AWS from 'aws-sdk';
import { useState } from "react";

function App() {
  
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    const S3_BUCKET = "tesis-s13";
    const REGION = "us-east-1";

    AWS.config.update({
      accessKeyId: "AKIATBRPQRURGKHDECI4",
      secretAccessKey: "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",
    });

    const s3 = new AWS.S3({
      params: {Bucket: S3_BUCKET},
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    var upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total + "%")
        );
      })
      .promise();

      await upload.then((err, data) => {
        console.log(err);
        alert("File uploaded succesfully.");
      })

  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFile(file)
  }

  return (
    <div className="App">
       <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

export default App;
