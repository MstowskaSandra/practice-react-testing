import React, { useState } from 'react';

const Md5Form = ({getMd5}) => {
    const [text, setText] = useState('');
    const [md5, setMd5] = useState('');

    function handleChange({target}) {
        setText(target.value);
        setMd5('');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMd5(await getMd5(text));
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>
                        <input value={text} onChange={handleChange} />
                    </label>
                </p>
                <p><button>send</button></p>
            </form>
            <p>
                <span className="data-text">{text}</span>
                { md5 && <span>=&gt;</span> }
                <strong className="data-md5">{md5}</strong>
            </p>
        </section>
    );
};

export default Md5Form;