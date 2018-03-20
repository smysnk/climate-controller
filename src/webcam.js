
import { exec } from 'child-process-promise';

export const capture = async () => {

  // Find the next number in the sequence
  let result = await exec('ls', { cwd: './webcam' });
  let fileList = result.stdout.split('\n');
  let i = 0;
  let foundNext = false;

  while (!foundNext) {

    if (fileList.indexOf(`capture${ i }.jpg`) === -1) {
      foundNext = true;
      continue;
    }
    i++;

  }

  let command = (process.env.LOCAL_DEVELOPMENT) ? `cp demo.jpg capture${ i }.jpg` : `fswebcam -r 640x480 --jpeg 80 --flip v capture${ i }.jpg`;
  let { stdout, stderr } = await exec(command, { cwd: './webcam' });
  console.log(stdout, stderr);

};


export const makeTimelapse = async () => {

  let { stdout, stderr } = await exec('ffmpeg -pix_fmt yuv420p -framerate 10 -y -i capture%d.jpg output.mp4', { cwd: './webcam' });
  console.log(stdout, stderr);

};