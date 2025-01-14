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
    <DraggableText
      id="Header"
      defaultPosition={{"mobile":{"x":85,"y":328},"desktop":{"x":575,"y":249}}}
    >
      <div className='Columns'>
        <Clock container={container} />
        <ResponsiveText
          defaultFontSize="30"
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
          containerRef={container}
          defaultFontSize="60"
          className="HebDate"
          title={hebDate}
        />
        <ResponsiveText
          containerRef={container}
          defaultFontSize="55"
          className="EngDate"
          title={engDate}
        />
      </div>
    </DraggableText>
  );
};

export default Header;
