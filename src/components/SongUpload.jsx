import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { store, useGlobalState } from 'state-pool';
import { createSongToken } from '../scripts/mintsong';
import { Link } from "react-router-dom";
store.setState("ipfsAudiofileUrl", "");
store.setState("songIsUploadedAndMinted", false);
const SongUpload = () => {
    const songId = 0;
    const [songTitle] = useGlobalState("songTitle");
    const [ipfsClient] = useGlobalState('ipfsClient');
    const [songIsUploadedAndMinted, setSongIsUploadedAndMinted] = useGlobalState('songIsUploadedAndMinted');
    const [songIsSubmitted, setSongIsSubmitted] = useGlobalState("songIsSubmitted"); 
    const [songSC] = useGlobalState("songContract");
    console.log("SongUpload Rendering", songSC);
    const [file, setFile] = useState(null);
    const [fileUrl, updateFileUrl] = useGlobalState('ipfsAudiofileUrl');
    const ref = useRef();
    const resetInput = () => {
        ref.current.value = "";
    };
    async function onChange(e) {
        console.log(e)
        const file = e.target.files[0];
        console.log('file:', file);
        setFile(file);
    }
    async function addToIpfs() {
        try {
            const added = await ipfsClient.add(file);
            const url = `http://ipfs.infura.io/ipfs/${added.path}`
            console.log("uploaded to ipfs in SongUpload:" + url);
            updateFileUrl(url);
            resetInput();
            const songtokenid = await createSongToken(songTitle);
            console.log(songtokenid)

        } catch (err) {
            console.error(err);
        }
    }
   
    if (songIsSubmitted) {
        addToIpfs();
        setSongIsSubmitted(false);
        // let trxEmitted = false;
        // while (!trxEmitted) {
        console.log("listening for emission on", songSC);
            songSC.on('TokenCreated', (idx, owner, addr) => {
            console.log("TokenCreated event emitted");
                console.log(idx, "::", owner, "::", addr);
                // trxEmitted = true;
            });
            console.log("listening for emitter")
        // }
        // console.log("SONGISSUBMITTED ==== False");
        setSongIsUploadedAndMinted(true);   
        }
    // }, []);
    return (
           <Box
                
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 1,
            m: 1,
          border: '3px pink',
          bgcolor: 'lightblue',
        }}
      >
      
            {/* <div className="upload-bar"> */}
            <h2>Create new BlockSong Token!</h2>
            {songIsUploadedAndMinted &&
                <p>Song has been uploaded: <Link to={`/song/${songId}`}>{songTitle }</Link></p>
            }
                <input type="file" ref={ref} onChange={onChange} />
            {/* </div> */}
        </Box>
    )
}

export default SongUpload