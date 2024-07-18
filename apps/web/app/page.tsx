"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import styles from "./page.module.css";

export default function Home() {
  const { sendMsg, messages } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <h1 className={styles["heading"]}>Chat App</h1>
      </div>
      <div className={styles["chat-container"]}>
        <div>All Chats</div>
        {messages?.map((m) => {
          return <div>{m}</div>;
        })}
      </div>
      <div className={styles["input-container"]}>
        <input
          type="text"
          className={styles["input"]}
          placeholder="Enter Text"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></input>
        <button onClick={() => sendMsg(message)} style={{ width: "10vw" }}>
          Send
        </button>
      </div>
    </div>
  );
}
