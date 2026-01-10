import 'dotenv/config';
import ImageKit from 'imagekit';

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

async function main() {
  console.log('🔍 Fetching files from ImageKit /pos-images folder...');

  try {
    const files = await imageKit.listFiles({
      path: '/pos-images',
      limit: 100, // Adjust as needed
    });

    if (files.length === 0) {
      console.log('No files found in /pos-images.');
      return;
    }

    console.log(`Found ${files.length} files:`);
    files.forEach((file) => {
      // Basic check to see if it's a file with url
      if ('url' in file) {
        console.log(`----------------------------------------`);
        console.log(`File ID: ${file.fileId}`);
        console.log(`Name:    ${file.name}`);
        console.log(`URL:     ${file.url}`);
        console.log(`Created: ${(file as any).createdAt}`);
        if ((file as any).tags) console.log(`Tags:    ${(file as any).tags.join(', ')}`);
      }
    });

  } catch (error) {
    console.error('Error fetching files from ImageKit:', error);
  }
}

main();
