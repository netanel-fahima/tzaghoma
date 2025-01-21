import './App.css';
import Clock from "./Clock";
import { getParasha, getHebDate, getCurrentDateStr } from "./utils/dataManager";
import ResponsiveText from "./components/ResponsiveText/ResponsiveText";
import DraggableText from "./components/DraggableText/DraggableText";

const Header = ({ container }) => {
  const hebDate = getHebDate();
  const engDate = getCurrentDateStr();
  const parasha = getParasha();

  return (
    <DraggableText id="Header">
      <div className='Columns'>
        <Clock container={container} />
        <ResponsiveText
          id="Header-Title"
          className="MessagesTitle"
          title={
            <div className='Columns Parasha' style={{ gap: '0' }}>
              <div>פרשת</div>
              <div>{parasha}</div>
            </div>
          }
          containerRef={container}
        />
        <ResponsiveText
          id="Header-HebDate"
          containerRef={container}
          className="HebDate"
          title={hebDate}
        />
        <ResponsiveText
          id="Header-EngDate"
          containerRef={container}
          className="EngDate"
          title={engDate}
        />
      </div>
    </DraggableText>
  );
};

export default Header;
