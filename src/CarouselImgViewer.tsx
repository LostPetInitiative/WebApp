import * as React from "react";
import AnimalPhotos from "./AnimalPhotos";
import { AnimalPhoto } from "./DataModel";
import './CarouselImgViewer.scss'

type PropsType = {
    imgSrcArray: AnimalPhoto[]
    onImgIdxChange?: (idx:number) => void;
}

export function CarouselImgViewer(props: PropsType) {
    const total = props.imgSrcArray.length;
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    React.useEffect(() => {
        props.onImgIdxChange?.(selectedIndex);
        console.log(`effect img change: ${selectedIndex} ${props.onImgIdxChange}`)
    },[props.onImgIdxChange, selectedIndex])

    const selectIndex = (selected : number) => {
        setSelectedIndex(selected%total);
    }

    const decreaseIndex = (total : number) => {
        setSelectedIndex(prev => (total + prev-1)%total)
    }

    const increaseIndex = (total : number) => {
        setSelectedIndex(prev => (total + prev+1)%total)
    }

    function carouselDots(total : number, selected : number) {
        const dotsArr: JSX.Element[] = [];
        for (let i = 0; i < total; i++) {
            dotsArr.push(<div className={`carouselDot ${selected !== i ? "" : "carouselSelectedDot"}`} onClick={() => this.selectIndex(total, i)} key={i.toString()}>▢</div>);
        }
    
        return (
            <div className="carouselDots">{dotsArr}</div>
        )
    }
  
    
        //const s : React.CSSProperties = {background: "red", width:"100%", height:"100%"}
      return (
          <div className="carouselImgViewer">
              <div className={`carouselImgViewerMainPhoto ${props.imgSrcArray.length > 1 ? "" : "onePhotoCard"}`}>
                  <img alt="Фото животного" src={props.imgSrcArray[selectedIndex].srcUrl} className="carouselImgViewerMainImg"/>
                  {/* <div style={s}></div> */}
              </div>
              <div className={`carouselImgViewer2row ${props.imgSrcArray.length > 1 ? "" : "displayNone"}`}>
                <div className="carouselImgViewerGoLeft" onClick={() => decreaseIndex(props.imgSrcArray.length)}>⇦</div>
                <div className="carouselImgViewerMiniPhotos">
                    <AnimalPhotos photos={props.imgSrcArray} selectedInd={selectedIndex}/>
                </div>
                <div className="carouselImgViewerGoRight" onClick={() => increaseIndex(props.imgSrcArray.length)}>⇨</div>
                <div className="carouselImgViewerDots">
                    {carouselDots(props.imgSrcArray.length, selectedIndex)}
                </div>
              </div>
          </div>
      )
}