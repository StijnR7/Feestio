import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config/firebase";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Admin from "./admin/admin";
import PartyDetails from "./partyDetails/partyDetails";
import Update from "./update/update";
import Login from "./login/login";
import Home from "./home/home";
import Account from "./account/account"
import Friends from "./friends/friends";

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="party/:id" element={<PartyDetails />} />
        <Route path="admin/update/:id" element={<Update />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home/>}/>
        <Route path="account/:id" element={<Account/>}/>
          <Route path="/friends" element={<Friends />} />
      </Routes>
    </>
  );
}

export default App;
