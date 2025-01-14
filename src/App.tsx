import "./App.css";
import Header from "./Header";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { getViewTimes } from "./utils/dataManager"; // Corrected function name
import ResponsiveText from "./components/ResponsiveText/ResponsiveText";
import DraggableText from "./components/DraggableText/DraggableText";
import ZmanTfila from "./ZmanTfila";
import HodatHerum from "./HodatHerum";
import useDimensions from "./hooks/useDimensions";

const isLandscapeMobile = (): boolean => {
  return window.matchMedia("only screen  and  (orientation: landscape)")
    .matches;
};

const isRealMobile = (): boolean => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

function App(props: any) {
  const [holtTimes, setHolTimes] = useState<{ Desc: string; Hour: string }[]>([
    { Desc: "שחרית", Hour: "8:00" },
    { Desc: "שחרית", Hour: "8:00" },
    { Desc: "שחרית", Hour: "8:00" },
    { Desc: "שחרית", Hour: "8:00" },
    { Desc: "שחרית", Hour: "8:00" },
    { Desc: "שחרית", Hour: "8:00" },
    { Desc: "שחרית", Hour: "8:00" },
    { Desc: "שחרית", Hour: "8:00" },
    { Desc: "שחרית", Hour: "8:00" },
  ]);

  const { maxX, maxY, width, height } = useDimensions();

  const isLandscape = width < height;

  const [shabatTimes, setShabatTimes] = useState<
    { Desc: string; Hour: string }[]
  >([{ Desc: "כניסת שבת", Hour: "18:00" }]);
  const [synName, setSynName] = useState("שם בית הכנסת");

  const [imgRightFooter, setImgRightFooter] = useState("logo-zag-digital.png");
  const [textRightFooter, setTextRightFooter] = useState("052-329-2977");

  const [imgLeftFooter, setImgLeftFooter] = useState("logo-netivot.png"); // Corrected setter name
  const [textLeftFooter, setTextLeftFooter] = useState(
    "בחסות מחלקת בטחון,עיריית נתיבות"
  );

  const [showAlert, setShowAlert] = useState(false);

  // useEffect(() => {
  //   if (isLandscapeMobile() && isRealMobile() && !showAlert) {
  //     alert("נא לבטל מצב סיבוב אוטומטי בהגדרות המכשיר");
  //     setShowAlert(true);
  //   }
  //   if (!isLandscapeMobile() && isRealMobile() && showAlert) {
  //     setShowAlert(false);
  //   }
  // }, [isLandscape]);

  const [bgImage, setBgImage] = useState(
    "https://a-digital.co.il/images/bg_images/4win_bg_with_footer.jpg"
  );
  const [isCanEditFooter, setIsCanEditFooter] = useState(false); // Renamed for consistency
  const [title1, setTitle1] = useState("זמנים לחול");
  const [title2, setTitle2] = useState("זמנים לשבת");
  const [title3, setTitle3] = useState("שהשמחה במעונם");
  const [title4, setTitle4] = useState("הודעות");
  const [messageText1, setMessageText1] = useState("הודעה 1");
  const [messageText2, setMessageText2] = useState("הודעה 2");
  const [cityCode, setCityCode] = useState("");
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    const appUrl = process.env.REACT_APP_API_URL;

    try {
      axios
        .get(appUrl + `api/InitialData/` + props.synId)
        .then((res) => {
          if (res.data.SubscriptionType === "PREMIUM") {
            // Use '===' for strict comparison
            setIsCanEditFooter(true);
          }
          if (res.data.Footer != null) {
            setTextLeftFooter(res.data.Footer.textLeftFooter);
            setTextRightFooter(res.data.Footer.textRightFooter);
            setImgLeftFooter(
              appUrl + "images/" + res.data.Footer.imgLeftFooter
            );
            setImgRightFooter(
              appUrl + "images/" + res.data.Footer.imgRightFooter
            );
          }
          if (res.data.Screens.length === 0) {
            // Use '===' for strict comparison
            setBgImage(
              appUrl + "images/bg_images/" + "4win_bg_with_footer.jpg"
            );
          } else {
            setBgImage(
              appUrl + "images/bg_images/" + res.data.Screens[0].BgImageName
            );
          }
        })
        .catch((error) => {
          console.error("Error loading initial data: ", error);
        });
    } catch (error) {
      console.error("Error in get initial data: ", error);
    }

    const updateData = () => {
      try {
        axios
          .get(appUrl + `api/GeneralData/` + props.synId)
          .then((res) => {
            setHolTimes(
              getViewTimes(res.data.Times, "CHOL", res.data.CityCode)
            );
            setShabatTimes(
              getViewTimes(res.data.Times, "SHABAT", res.data.CityCode)
            );
            setTitle1(res.data.Title1?.trim());
            setTitle2(res.data.Title2?.trim());
            setTitle3(res.data.Title3?.trim());
            setTitle4(res.data.Title4?.trim());
            setSynName(res.data.SynName?.trim());
            setCityCode(res.data.CityCode?.trim());
            setCityName(res.data.CityName?.trim());
            setMessageText1(res.data.MessageText1?.trim());
            setMessageText2(res.data.MessageText2?.trim());
            if (
              res.data.Command &&
              res.data.Command.CommandText === "REFRESH"
            ) {
              // Corrected command check
              console.log(
                "Preparing to refresh: " + new Date().toLocaleTimeString()
              );
              setTimeout(() => {
                window.location.reload();
              }, 10000);
              console.log(
                "Started refresh: " + new Date().toLocaleTimeString()
              );
            }
          })
          .catch((error) => {
            console.error("Error fetching general data: ", error);
          });
      } catch (error) {
        console.error("Error in interval fetching data: ", error);
      }
    };
    updateData();
    const interval = setInterval(() => {
      updateData();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const containerRef = useRef(null);

  return (
    <div className="App" ref={containerRef}>
      <Header container={containerRef} />

      <DraggableText
        id="SynName"
        defaultPosition={{
          mobile: { x: 294, y: 319 },
          desktop: { x: 571, y: 86 },
        }}
      >
        <ResponsiveText
          defaultFontSize="35"
          className="SynName"
          title={synName}
          containerRef={containerRef}
        />
      </DraggableText>

      <ZmanTfila
        dragKey="Area"
        className="AreaTitle"
        title={title2}
        times={shabatTimes}
        containerRef={containerRef}
        defaultPosition={{
          mobile: { x: 194, y: 40 },
          desktop: { x: 69, y: 116 },
        }}
      />

      <DraggableText
        id="Sponsored"
        defaultPosition={{ mobile: { x: 0, y: 0 }, desktop: { x: 11, y: 680 } }}
      >
        <div className="Row">
          <img src={imgLeftFooter} className="logo" width={70} height={40} />
          <ResponsiveText
            defaultFontSize="110"
            className="Sponsored"
            title={textLeftFooter}
            containerRef={containerRef}
          />
        </div>
      </DraggableText>

      <ZmanTfila
        className="AreaTitle"
        dragKey="ZmanTfila"
        title={title1}
        times={holtTimes}
        containerRef={containerRef}
        defaultPosition={{
          mobile: { x: 257, y: 611 },
          desktop: { x: 1075, y: 112 },
        }}
      />

      <DraggableText
        id="Messages"
        defaultPosition={{
          mobile: { x: 78, y: 56 },
          desktop: { x: 68, y: 477 },
        }}
      >
        <ResponsiveText
          defaultFontSize="70"
          className="AreaTitle"
          title={title4}
          containerRef={containerRef}
        />

        <ResponsiveText
          defaultFontSize="85"
          className="AreaMessageText"
          title={
            <div className="Columns">
              {messageText2?.split("\n").map((str) => (
                <div>{str}</div>
              ))}
            </div>
          }
          containerRef={containerRef}
        />
      </DraggableText>

      <DraggableText
        id="Notes"
        defaultPosition={{
          mobile: { x: 49, y: 613 },
          desktop: { x: 1070, y: 477 },
        }}
      >
        <ResponsiveText
          defaultFontSize="70"
          className="AreaTitle"
          title={title3}
          containerRef={containerRef}
        />

        <ResponsiveText
          defaultFontSize="90"
          className="AreaMessageText"
          title={
            <div className="Columns" style={{ marginTop: 8 }}>
              {messageText1?.split("\n").map((str) => (
                <div>{str}</div>
              ))}
            </div>
          }
          containerRef={containerRef}
        />
      </DraggableText>

      {isCanEditFooter && (
        <DraggableText
          id="BottomTitle"
          defaultPosition={{
            desktop: { x: 767, y: 108 },
            mobile: { x: 0, y: 0 },
          }}
        >
          <ResponsiveText
            defaultFontSize="35"
            className="BottomTitle"
            title={textRightFooter}
            containerRef={containerRef}
          />

          <img
            src={imgRightFooter}
            className="logo"
            alt=""
            width={160}
            height={50}
          />
        </DraggableText>
      )}

      <HodatHerum
        cityCode={cityCode}
        cityName={cityName}
        container={containerRef}
      />
    </div>
  );
}

export default App;
