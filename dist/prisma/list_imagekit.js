"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const imagekit_1 = __importDefault(require("imagekit"));
const imageKit = new imagekit_1.default({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});
async function main() {
    console.log('🔍 Fetching files from ImageKit /pos-images folder...');
    try {
        const files = await imageKit.listFiles({
            path: '/pos-images',
            limit: 100,
        });
        if (files.length === 0) {
            console.log('No files found in /pos-images.');
            return;
        }
        console.log(`Found ${files.length} files:`);
        files.forEach((file) => {
            if ('url' in file) {
                console.log(`----------------------------------------`);
                console.log(`File ID: ${file.fileId}`);
                console.log(`Name:    ${file.name}`);
                console.log(`URL:     ${file.url}`);
                console.log(`Created: ${file.createdAt}`);
                if (file.tags)
                    console.log(`Tags:    ${file.tags.join(', ')}`);
            }
        });
    }
    catch (error) {
        console.error('Error fetching files from ImageKit:', error);
    }
}
main();
//# sourceMappingURL=list_imagekit.js.map