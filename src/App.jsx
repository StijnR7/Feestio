import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {getDocs, collection, doc, addDoc, deleteDoc, updateDoc} from 'firebase/firestore'
import { db } from './config/firebase';
import {useEffect, useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./admin/admin";
import PartyDetails from "./partyDetails/partyDetails";
import Update from './update/update';

function App() {
   
    return (
        <>
           <Routes>
            <Route path="/" element={<Admin/>}/>
            <Route path="party/:id" element={<PartyDetails/>}/>
             <Route path="update/:id" element={<Update />} />
           </Routes>
        </>
    )

}

export default App