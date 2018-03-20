let AWS = require('aws-sdk');
let fs = require('fs');

let s3 = new AWS.S3();

export const uploadTimelapse = async () => {

  let myBucket = 'climatecontroller';

  let myKey = 'output.mp4';
  fs.readFile('./webcam/output.mp4', (err, data) => {

    if (err) {

      throw err;

    }

    let params = { Bucket: myBucket, Key: myKey, Body: data, ACL: 'public-read' };
    s3.putObject(params, (err, data) => {

      if (err) {

        console.log(`Failed uploading to s3: ${ err }`);

      } else {

        console.log(`Successfully uploaded data to ${ myBucket }/${ myKey }`);

      }

    });

  });

};
