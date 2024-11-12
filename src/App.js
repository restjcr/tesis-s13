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
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    try {
      // Subir archivo a S3
      await s3.putObject(params).on("httpUploadProgress", (evt) => {
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      }).promise();

      console.log("File uploaded successfully.");

      // Llamar a la función Lambda con el nombre del archivo
      await callLambdaFunction(file.name);

    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  // Función para llamar a Lambda y pasar el nombre del archivo
  const callLambdaFunction = async (fileName) => {
    try {
      const response = await fetch("https://iaw2ndrhj5orzxum4zomn4pcki0obobp.lambda-url.us-east-1.on.aws/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileName, // Parámetro con el nombre del archivo
        }),
      });
      
      if (!response.ok) {
        throw new Error("Error en la respuesta de Lambda");
      }

      const result = await response.json();
      console.log("Respuesta de Lambda:", result);
      alert("Lambda invocada con éxito");

    } catch (error) {
      console.error("Error al invocar Lambda:", error);
      alert("Error al invocar Lambda.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

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
