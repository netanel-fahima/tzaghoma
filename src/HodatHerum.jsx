import { useEffect, useState } from "react";
import axios from "axios";
import { getAppUrl } from "./utils/helper";
import backgroundUrl from "./img/pikud_haaoref.jpg";
import ResponsiveText from "./components/ResponsiveText/ResponsiveText";


const HodatHerum = ({ cityCode, cityName , container }) => {
    const [hide, setHide] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let interval = setInterval(() => {
            try {
                let cityCodeStr = cityCode || 0;
                axios.get(process.env.REACT_APP_API_URL + `api/HodatHerum/` + cityCodeStr)
                    .then((res) => {
                        setMessage(res.data.Text);
                        setHide(!(cityCodeStr && res.data.Text));
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } catch (error) {
                console.error("error in hodat herum interval" + error);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [cityCode]);

    return (
        <div
            style={{
                backgroundImage: `url(.${backgroundUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100%",
                paddingTop: "50px",
                width: "100%",
                position: "fixed",
                height: "20%",
                left: "0",
                bottom: "0",
                zIndex: "1000",
                display: hide ? "none" : "block"
            }}
        >
            <span
                style={{
                    color: "orange",
                    fontSize: "20px",
                    fontWeight: "bolder",
                    position: "absolute",
                    top: "11%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                הודעת חירום של עירית {cityName}
            </span>
            <marquee width="80%" direction="left" style={{ fontSize: "20px", fontWeight: "bolder", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <ResponsiveText
                id="HodatHerum"
                title={message}
                containerRef={container}
                />
            </marquee>
        </div>
    );
};

export default HodatHerum;
