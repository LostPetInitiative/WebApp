
import * as React from "react";
import Header from "../Header";
import { Chart } from "react-google-charts";
import { useTranslation } from "react-i18next";
import { Spinner, SpinnerSize } from "@fluentui/react";
import * as urls from '../urls'

import "./Vitals.scss"


  

function useNamespaceVitals(solrGatewayURL:string, namespace: string) {
    const [totalCount,setTotalCount] = React.useState<number|undefined>(undefined)
    const [countPerDay,setCountPerDay] = React.useState<Map<string,number>|undefined>(undefined)

    React.useEffect(() => {
        fetch(`${solrGatewayURL}/recentCrawledStats/${namespace}`).then(fetched => {
            if (fetched.ok) {
                fetched.json().then(parsed => {
                    // console.log("fetched", parsed)
                    setTotalCount(parsed.response.numFound)
                    const arr:Array<string> = parsed.facet_counts.facet_ranges.card_creation_time.counts
                    const resMap:Map<string,number> = new Map<string,number>()
                    for (let i=0;i < arr.length/2;i++) {
                        resMap.set(arr[i*2], parseInt(arr[i*2+1]))
                    }
                    setCountPerDay(resMap)
                }, () => {console.error("Failed to parse json")})
            } else {
                console.error(`Failed to get vitals for namespace: ${fetched.statusText}:${fetched.status}`)
            }
            
        },err => {
            console.log(`Failed to get vitals for namespace ${namespace}:`,err)
        })
    },[namespace,solrGatewayURL])

    return {
        totalCount,
        countPerDay
    }
}

function CountTile(props:{iconURL:string, partnerLink:string, count:number}) {
    const {partnerLink,iconURL, count } = props;
    if (!count) return null;
    const countStr = count.toLocaleString("en").replace(','," ")
    return (
        <a href={partnerLink} target="_blank" rel="external noopener noreferrer">
        <div key={partnerLink} className="countTileContainer">
            <img src={iconURL} alt={partnerLink} title={partnerLink} width="25px" height="25px"/>
            <p >{countStr}</p>
        </div>
        </a>
    )
}
  
export function VitalsPage(props:{solrGatewayURL:string}) {
    const { solrGatewayURL } = props;

    const {t} = useTranslation()

    const titleLocStr = t("vitals.chartTitle")
    const hAxisTitleLocStr = t("vitals.hAxisTitle")
    const vAxisTitleLocStr = t("vitals.vAxisTitle")

    const {totalCount:totalCountPet911,countPerDay:perDayPet911} = useNamespaceVitals(solrGatewayURL, "pet911ru")
    const {totalCount:totalCountPoiskZoo,countPerDay:perDayPoiskZoo} = useNamespaceVitals(solrGatewayURL, "poiskzoo")
    const {totalCount:totalCountVkNsk,countPerDay:perDayVkNsk} = useNamespaceVitals(solrGatewayURL, "vk-poterjashkansk")
    const {totalCount:totalCountVkEkb,countPerDay:perDayVkEkb} = useNamespaceVitals(solrGatewayURL, "vk-club46290079")
    const {totalCount:totalCountVkNn,countPerDay:perDayVkNn} = useNamespaceVitals(solrGatewayURL, "vk-poteryashkinn")

    const data = React.useMemo(() => {
        const result:Array<Array<string|number>> = []
        // header
        const headerRow :Array<string> = ["Date"]

        const datesData:Array<Array<string|number>> = []

        const addDataSourceToDataTable = (perDayCountsDict:Map<string,number>, crawlerName: string) => {
            // Example of needed schema:
            // we have the first column: day
            // other columns: counts
            //
            // const data = [
            //     ["City", "2010 Population", "2000 Population"],
            //     ["New York City, NY", 8175000, 8008000],
            //     ["Los Angeles, CA", 3792000, 3694000],
            //     ["Chicago, IL", 2695000, 2896000],
            //     ["Houston, TX", 2099000, 1953000],
            //     ["Philadelphia, PA", 1526000, 1517000],
            //   ];
            

            const keys = Array.from(perDayCountsDict.keys()).sort()
            for (let i=0;i< keys.length; i++){
                const key = keys[i]
                const d = new Date(key)
                const dateStr = d.toLocaleDateString()
                if (datesData.length == i) {
                    // adding new date (first column)
                    datesData.push([dateStr])
                }
                const row = datesData[i]
                // validating date
                if (row[0] != dateStr) {
                    console.error("Different sets of dates across different data sources stats")
                }
                row.push(perDayCountsDict.get(key))
            }

            headerRow.push(crawlerName)
        }

        if(perDayPet911) addDataSourceToDataTable(perDayPet911,"pet911.ru");
        if(perDayPoiskZoo) addDataSourceToDataTable(perDayPoiskZoo,"Poiskzoo.ru");
        if(perDayVkNsk) addDataSourceToDataTable(perDayVkNsk,"vk.com/poterjashkansk");
        if(perDayVkEkb) addDataSourceToDataTable(perDayVkEkb,"vk.com/club46290079");
        if(perDayVkNn) addDataSourceToDataTable(perDayVkNn,"vk.com/poteryashki_nn");
        
        result.push(headerRow)
        result.push(...datesData)
        return result
        }
    ,[perDayPet911, perDayPoiskZoo, perDayVkNsk, perDayVkEkb, perDayVkNn])

    const totalCards =
        (totalCountPet911??0) +
        (totalCountPoiskZoo??0) +
        (totalCountVkNsk??0) +
        (totalCountVkEkb??0) +
        (totalCountVkNn??0)

    const options = {
        title: titleLocStr,
        chartArea: { width: "70%" },
        isStacked: true,
        hAxis: {
            title: hAxisTitleLocStr,
        },
        vAxis: {
            title: vAxisTitleLocStr,
            minValue: 0,
        },
        };

    let chartArea : JSX.Element = null
    if (data.length>1) {
        const totalCardsPrefixLocStr = t("vitals.totalCardsPrefix")
        const totalCardsSuffixLocStr = t("vitals.totalCardsSuffix")
        const inParticularLocStr = t("vitals.inParticular")
        const totalCardsStr = totalCards.toLocaleString('en').replace(','," ")

        const perSourceCountTiles = [
            CountTile({partnerLink:"https://pet911.ru", iconURL: urls.Pet911IconURL, count:totalCountPet911}),
            CountTile({partnerLink:"https://poiskzoo.ru", iconURL: urls.PoiskzooIconURL, count:totalCountPoiskZoo}),
            CountTile({partnerLink:"https://vk.com/poterjashkansk", iconURL: urls.VkNSKIconURL, count:totalCountVkNsk}),
            CountTile({partnerLink:"https://vk.com/club46290079", iconURL: urls.VkIconURL, count:totalCountVkEkb}),
            CountTile({partnerLink:"https://vk.com/poteryashki_nn", iconURL: urls.VkIconURL, count:totalCountVkNn}),
        ]

        chartArea = (
            <>
            <div style={{display:"flex", flexDirection:"row", alignContent:"center"}}>
                <p>{totalCardsPrefixLocStr}<strong>&nbsp;{totalCardsStr}&nbsp;</strong>{totalCardsSuffixLocStr}.</p>
                &nbsp;<p>{inParticularLocStr}</p>{perSourceCountTiles}
            </div>
            <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
                />
            </>)
    }
    else {
        const loadingLocStr = t("common.loading")
        chartArea = <Spinner label={loadingLocStr} size={SpinnerSize.large} />
    }

    return (
        <>
        <Header />
        <div style={{padding:"16px"}}>
            {chartArea}
        </div>
        </>
    );
}
