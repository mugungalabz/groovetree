import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
// import { create } from 'ipfs-http-client';
import { createSongToken } from '../scripts/mintsong';
import { ipfsUri } from '../scripts/ipfs';
import { Link } from "react-router-dom";
import { ethers } from 'ethers';
/**
 *
 * @param {*} props
*   songSubmitted: a boolean determining if the song was submitted
    setSongSubmitted: a setter to set the state of songSubmitted
    musicNftContract: a ethers.js Contract with account.signer injected
    songImageFile: a file (not sure of type) of the image
    songMetaData: an object representing the metadata about the song
 * @returns
 */
const SongUpload = (props) => {
    console.log("RENDERING SongUpload, submitted:", props.songSubmitted);
    const [lastSongId, setLastSongId] = useState(-1);
    const [transactionHash, setTransactionHash] = useState(null);
    const [songMinted, setSongMinted] = useState(false);
    const [mintingSong, setMintingSong] = useState(false);
    const [file, setFile] = useState(null);
    const ref = useRef();
    const resetInput = () => {
        ref.current.value = "";
    };

    // useEffect(() => {
    //     if (mintingSong && props.musicNftContract) {
    //         console.log("listening for emission on", props.musicNftContract);
    //         listenForTokenCreation();
    //     }
    // }, [mintingSong])
    // async function listenForTokenCreation() {
    //     props.musicNftContract.on('Transfer', (from, to, tokenId) => {
    //         console.log("TokenCreated event emitted");
    //         console.log(from, "::", to, "::", tokenId);
    //         setLastSongId(tokenId);
    //         setSongMinted(true);
    //         setMintingSong(false);
    //     });
    // }
    useEffect(() => {
        if (props.songSubmitted) {
            console.log("use effect for songSubmitted")
            props.setSongSubmitted(false);
            setMintingSong(true);
            setSongMinted(false);
            console.log("Song has been submitted in SongUpload, minting song")
            mintSong();
        }
    }, [props.songSubmitted]);

    async function onChange(e) {
        const file = e.target.files[0];
        setFile(file);
    }
    async function mintSong() {
        // console.log("MINT SONG")
        console.log("metadata props in Song upload", props.songMetaData);
        try {
            var data = {
                ...props.songMetaData,
                audio: file,
                image: props.songImageFile
            }
            // const added = await ipfsclient.add(file);
            // const url = `http://ipfs.infura.io/ipfs/${added.path}`
            const uri = await ipfsUri(data); //sTODO: fix how this ipfsUri is made
            console.log('IPFS uri created:', uri);
            // updateFileUrl(url);
            //sTODO: Allow user to input royalty
            createSongToken(props.musicNftContract, uri, 1n).then(([transactionHash, tokenId]) => {
                console.log("HERE!!transactionHash: ", transactionHash);
                console.log("HERE!!tokenId: ", tokenId);
                setMintingSong(false);
                setSongMinted(true);
                setLastSongId(Number(tokenId)); //Need to convert the BigInt to a Number
                setTransactionHash(transactionHash);
            })

            setMintingSong(true);
            resetInput();
        } catch (err) {
            console.error(err);
        }
    }

    var songComponent;
    if (mintingSong) {
        songComponent = <div>
            <p>Minting song...</p>
        </div>
    } else if (songMinted) {
        songComponent = <div>
            <p>
                <Link to={`/song/${lastSongId}`}> "{props.songMetaData.title}"</Link> has been minted! With ID: {lastSongId}
                <br/> Transaction Hash: <a href={`https://rinkeby.etherscan.io/tx/${transactionHash}`}> {transactionHash}</a>
            </p>
        </div>
    }
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

            <h2>Create new BlockSong Token!</h2>
            {songComponent}
            {/* {songMinted && lastSongId > -1 &&
                <p>Song has been uploaded: <Link to={`/song/${lastSongId}`}>{props.songTitle }</Link></p>
            } */}
            <input type="file" ref={ref} onChange={onChange} />
        </Box>
    )
}

export default SongUpload