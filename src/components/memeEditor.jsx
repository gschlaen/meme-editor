import React, {useState, useEffect} from 'react';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable';
import './memeEditor.css'
import { getMemes } from '../../src/services/getMemes';


const MemeEditor = () => {

    const [memeList, setMemeList] = useState([]);
    const [activeImage, setActiveImage] = useState('');
    const [inputText, setInputText] = useState({topText: "", bottomText: ""});
    const [textColor, setTextColor] = useState({topColor: "#FFF", bottomColor: "#FFF"});
    const [textSize, setTextSize] = useState({topSize: "40px", bottomSize: "40px"});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMemes();
                setMemeList(response);
                setActiveImage(response[0].url);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setInputText({
          ...inputText,
          [e.target.name]: e.target.value,
        })
    }

    const handleColorChange = (e) => {
        setTextColor({
          ...textColor,
          [e.target.name]: e.target.value,
        })
    }

    const handleSizeChange = (e) => {
        setTextSize({
            ...textSize,
            [e.target.name]: e.target.value,
          })
    }

    const onChangeImage = (e) => {
        setActiveImage(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        html2canvas(document.querySelector('.meme'), { logging: true, letterRendering: 1, allowTaint: false, useCORS: true }).then(canvas => {
            let img = canvas.toDataURL('image/jpg');
            let elem = document.createElement('a');
            elem.download = 'meme.jpg';
            elem.href = img;
            elem.click();
            elem.remove();
        });
    }

    return (
        <div className="meme-container">
            
            <form onSubmit={handleSubmit}>
                <h2 className="titleText">Pick an image</h2>
                <select onChange={onChangeImage}>
                    {memeList.map((meme) => (
                      <option key={meme.id} value={meme.url}>
                        {meme.name}
                      </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="topText"
                    placeholder="Add Top Text"
                    value={inputText.topText}
                    onChange={handleInputChange}
                />
                <div className='settings'>
                    <div>
                        <h5>Pick text color</h5>
                        <input type="color" name="topColor" onChange={handleColorChange}></input>
                    </div>
                    <div>
                        <h5>Pick text size</h5>
                        <select name="topSize" value={textSize.topSize} onChange={handleSizeChange}>
                            <option value='30px'>Small</option>
                            <option value='40px'>Medium</option>
                            <option value='50px'>Large</option>
                        </select>
                    </div>
                </div>
                <input
                    type="text"
                    name="bottomText"
                    placeholder="Add Bottom Text"
                    value={inputText.bottomText}
                    onChange={handleInputChange}
                />
                <div className='settings'>
                    <div>
                        <h5>Pick text color</h5>
                        <input type="color" name="bottomColor" onChange={handleColorChange}></input>
                    </div>
                    <div>
                        <h5>Pick text size</h5>
                        <select name="bottomSize" value={textSize.bottomSize} onChange={handleSizeChange}>
                            <option value='30px'>Small</option>
                            <option value='40px'>Medium</option>
                            <option value='50px'>Large</option>
                        </select>
                    </div>
                </div>
                <button type='submit'>Download Meme</button>
            </form>
            <div className="meme">
                <img src={activeImage} alt="Meme" />
                <Draggable>
                  <h2 className="top" style={{color: textColor.topColor, fontSize: textSize.topSize}}>{inputText.topText}</h2>
                </Draggable>
                <Draggable>
                  <h2 className="bottom" style={{color: textColor.bottomColor, fontSize: textSize.bottomSize}}>{inputText.bottomText}</h2>
                </Draggable>
            </div>
        </div>
        
    );
}

export default MemeEditor;
