import * as React from "react";
import AnimalPhotos from "./AnimalPhotos";
import { AnimalPhoto } from "../DataModel";
import './CarouselImgViewer.scss'

type PropsType = {
    imgSrcArray: AnimalPhoto[]
    onImgIdxChange?: (idx:number) => void;
}

export function CarouselImgViewer(props: PropsType) {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const total = props.imgSrcArray.length

    React.useEffect(() => {
        props.onImgIdxChange?.(selectedIndex);
    },[props.onImgIdxChange, selectedIndex])

    const selectIndex = (i: number) => {
        if(total>0)
            setSelectedIndex(i%total)
    }

    const decreaseIndex = (total : number) => {
        if(total>0)
            setSelectedIndex(prev => (total + prev-1)%total)
    }

    const increaseIndex = (total : number) => {
        if(total>0)
            setSelectedIndex(prev => (total + prev+1)%total)
    }

    function carouselDots(total : number, selected : number) {
        const dotsArr: JSX.Element[] = [];
        for (let i = 0; i < total; i++) {
            dotsArr.push(<div className={`carouselDot ${selected !== i ? "" : "carouselSelectedDot"}`} onClick={() => selectIndex(i)} key={i.toString()}>▢</div>);
        }
    
        return (
            <div className="carouselDots">{dotsArr}</div>
        )
    }
  
    
        //const s : React.CSSProperties = {background: "red", width:"100%", height:"100%"}

      const mainImgElement = props.imgSrcArray.length>0 ?
        (<img alt="Фото животного" src={props.imgSrcArray[selectedIndex].srcUrl} className="carouselImgViewerMainImg"/>) :
        (<p>Нет фото</p>)

      return (
          <div className="carouselImgViewer">
              <div className={`carouselImgViewerMainPhoto ${props.imgSrcArray.length > 1 ? "" : "onePhotoCard"}`}>
                  {mainImgElement}
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