import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {getDocs, collection, doc} from 'firebase/firestore'
import { db } from './config/firebase';
import {useEffect, useState} from "react";

function App() {
    const [getTaskList, setTaskList] = useState([]);

    useEffect(()=>{
        const getTasks = async () => {
            const data = await getDocs(collection(db, "tasks"));
            setTaskList(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        getTasks();
    },[])

    return (
        <>
            {getTaskList.map(task => {
                return (
                    <h2 key={task.id}>{task.title}</h2>
                )
            })}
        </>
    )

}

export default App