import React from 'react';
import Md5Form from "./components/md5Form/Md5Form";
import {getMd5} from './providers/md5Provider';

const Task03 = () => {
    return (
        <section>
            <h1>Task03</h1>
            <Md5Form getMd5={getMd5} />
        </section>
    );
};

export default Task03;