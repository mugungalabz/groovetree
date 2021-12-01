const { create } = require("ipfs-http-client");
const ipfs = create("https://ipfs.infura.io:5001");
const IPFS_BASE_PATH = "https://gateway.ipfs.io/ipfs/";
const { CID } = require('multiformats/cid');
const { concat } = require('uint8arrays/concat');
const { toString } = require('uint8arrays/to-string');
const all = require('it-all');

async function getSong(sc, songId) {
    console.log("GETTING SINGLE SONG songID");
    var tokenUri = await sc.tokenURI(songId);
    console.log("tokenuri from SC = ", tokenUri);
    if (tokenUri.startsWith(IPFS_BASE_PATH)) {
        tokenUri = tokenUri.replace(IPFS_BASE_PATH, "");
    }
    console.log("adjusted token CID", tokenUri)
    const tokenCid = CID.parse(tokenUri);
    const uri = concat(await all(ipfs.cat(tokenCid)))
    const uriString = toString(uri);
    console.log(uriString)
    const parseuri = JSON.parse(uriString);
    console.log(parseuri);
    return parseuri;
}

export default getSong;